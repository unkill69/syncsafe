module {
  public type UserId = Principal;
  public type MeetingId = Text;
  public type TimeSlot = Nat;
  public type Preference = Nat;
  public type Availability = [Preference];
  
  public type Meeting = {
    id: MeetingId;
    title: Text;
    description: Text;
    date: Int;
    duration: Nat;
    organizer: UserId;
    participants: [UserId];
    selectedSlot: ?TimeSlot;
  };
}

