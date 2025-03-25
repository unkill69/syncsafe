import Array "mo:base/Array";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor SyncSafe {
  // Types
  type UserId = Principal;
  type MeetingId = Text;
  type TimeSlot = Nat; // Index of the time slot
  type Preference = Nat; // 0-5 preference value
  type Availability = [Preference]; // Array of preferences for each time slot
  
  type Participant = {
    name: Text;
    email: Text;
    principal: ?Principal;
  };
  
  type Meeting = {
    id: MeetingId;
    title: Text;
    description: Text;
    date: Time.Time;
    duration: Nat; // in minutes
    organizer: UserId;
    participants: [Participant];
    selectedSlot: ?TimeSlot;
  };
  
  // State
  stable var nextMeetingId: Nat = 0;
  let meetings = HashMap.HashMap<MeetingId, Meeting>(0, Text.equal, Text.hash);
  let availabilities = HashMap.HashMap<MeetingId, HashMap.HashMap<Text, Availability>>(0, Text.equal, Text.hash);
  
  // Helper functions
  func generateMeetingId() : MeetingId {
    let id = nextMeetingId;
    nextMeetingId += 1;
    return Nat.toText(id);
  };
  
  // Privacy-preserving argmax computation
  // This is a simplified version of the log-depth argmax algorithm
  func computeBestSlot(meetingId: MeetingId) : ?TimeSlot {
    switch (availabilities.get(meetingId)) {
      case (null) { return null; };
      case (?userAvailabilities) {
        let users = Iter.toArray(userAvailabilities.keys());
        if (users.size() == 0) { return null; };
        
        // Get the first user's availability as a starting point
        let firstUserAvail = switch (userAvailabilities.get(users[0])) {
          case (null) { return null; };
          case (?avail) { avail };
        };
        
        let slotCount = firstUserAvail.size();
        var aggregatedPreferences = Array.tabulate<Nat>(slotCount, func(i) = 0);
        
        // Compute the sum of preferences for each time slot
        for (userId in users.vals()) {
          switch (userAvailabilities.get(userId)) {
            case (null) {};
            case (?userAvail) {
              for (i in Iter.range(0, slotCount - 1)) {
                // Only consider slots where everyone is available (preference > 0)
                if (userAvail[i] > 0) {
                  aggregatedPreferences[i] += userAvail[i];
                } else {
                  // If any user is unavailable, set preference to 0
                  aggregatedPreferences[i] := 0;
                };
              };
            };
          };
        };
        
        // Find the slot with the highest aggregate preference
        var bestSlot: ?TimeSlot = null;
        var maxPreference: Nat = 0;
        
        for (i in Iter.range(0, slotCount - 1)) {
          if (aggregatedPreferences[i] > maxPreference) {
            maxPreference := aggregatedPreferences[i];
            bestSlot := ?i;
          };
        };
        
        return bestSlot;
      };
    };
  };
  
  // Public methods
  public shared(msg) func createMeeting(
    title: Text,
    description: Text,
    date: Time.Time,
    duration: Nat,
    participants: [Text] // Email addresses
  ) : async MeetingId {
    let caller = msg.caller;
    let id = generateMeetingId();
    
    // Convert email addresses to participant objects
    let participantObjects = Array.map<Text, Participant>(
      participants,
      func(email) : Participant {
        {
          name = "";
          email = email;
          principal = null;
        }
      }
    );
    
    let meeting: Meeting = {
      id;
      title;
      description;
      date;
      duration;
      organizer = caller;
      participants = participantObjects;
      selectedSlot = null;
    };
    
    meetings.put(id, meeting);
    availabilities.put(id, HashMap.HashMap<Text, Availability>(0, Text.equal, Text.hash));
    
    return id;
  };
  
  // Submit availability for authenticated users
  public shared(msg) func submitAvailability(
    meetingId: MeetingId,
    availability: Availability
  ) : async Bool {
    let caller = msg.caller;
    let callerText = Principal.toText(caller);
    
    switch (availabilities.get(meetingId)) {
      case (null) { return false; };
      case (?userAvailabilities) {
        userAvailabilities.put(callerText, availability);
        return true;
      };
    };
  };
  
  // Submit availability for non-authenticated users
  public func submitAnonymousAvailability(
    meetingId: MeetingId,
    name: Text,
    email: Text,
    availability: Availability
  ) : async Bool {
    switch (availabilities.get(meetingId)) {
      case (null) { return false; };
      case (?userAvailabilities) {
        // Use email as the key for anonymous users
        userAvailabilities.put(email, availability);
        
        // Add or update participant info in the meeting
        switch (meetings.get(meetingId)) {
          case (null) { return false; };
          case (?meeting) {
            // Check if participant already exists
            let existingParticipantIndex = Array.indexOf<Participant>(
              {name = name; email = email; principal = null},
              meeting.participants,
              func(a, b) { a.email == b.email }
            );
            
            let updatedParticipants = switch (existingParticipantIndex) {
              case (?index) {
                // Update existing participant
                Array.tabulate<Participant>(
                  meeting.participants.size(),
                  func(i) {
                    if (i == index) {
                      {name = name; email = email; principal = null}
                    } else {
                      meeting.participants[i]
                    }
                  }
                )
              };
              case (null) {
                // Add new participant
                Array.append<Participant>(
                  meeting.participants,
                  [{name = name; email = email; principal = null}]
                )
              };
            };
            
            let updatedMeeting: Meeting = {
              id = meeting.id;
              title = meeting.title;
              description = meeting.description;
              date = meeting.date;
              duration = meeting.duration;
              organizer = meeting.organizer;
              participants = updatedParticipants;
              selectedSlot = meeting.selectedSlot;
            };
            
            meetings.put(meetingId, updatedMeeting);
            return true;
          };
        };
      };
    };
  };
  
  public shared(msg) func finalizeMeeting(meetingId: MeetingId) : async Bool {
    let caller = msg.caller;
    
    switch (meetings.get(meetingId)) {
      case (null) { return false; };
      case (?meeting) {
        if (meeting.organizer != caller) { return false; };
        
        let bestSlot = computeBestSlot(meetingId);
        
        let updatedMeeting: Meeting = {
          id = meeting.id;
          title = meeting.title;
          description = meeting.description;
          date = meeting.date;
          duration = meeting.duration;
          organizer = meeting.organizer;
          participants = meeting.participants;
          selectedSlot = bestSlot;
        };
        
        meetings.put(meetingId, updatedMeeting);
        return true;
      };
    };
  };
  
  public query func getMeeting(meetingId: MeetingId) : async ?Meeting {
    return meetings.get(meetingId);
  };
  
  public query func getUserMeetings(userId: UserId) : async [Meeting] {
    let userMeetings = Array.mapFilter<(MeetingId, Meeting), Meeting>(
      Iter.toArray(meetings.entries()),
      func((_, meeting)) {
        if (meeting.organizer == userId) {
          ?meeting
        } else {
          // Check if user is a participant
          let isParticipant = Array.find<Participant>(
            meeting.participants, 
            func(p) { 
              switch (p.principal) {
                case (?principal) { principal == userId };
                case (null) { false };
              }
            }
          ) != null;
          
          if (isParticipant) { ?meeting } else { null }
        }
      }
    );
    
    return userMeetings;
  };
  
  // System methods
  system func preupgrade() {
    // Handle state before upgrade
    Debug.print("Preparing for upgrade");
  };
  
  system func postupgrade() {
    // Handle state after upgrade
    Debug.print("Upgrade complete");
  };
}

