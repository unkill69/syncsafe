import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";

module {
  // Log-depth argmax algorithm for privacy-preserving computation
  public func argmax(preferences: [[Nat]]) : ?Nat {
    if (preferences.size() == 0 or preferences[0].size() == 0) {
      return null;
    };
    
    let numUsers = preferences.size();
    let numSlots = preferences[0].size();
    
    // Initialize aggregated preferences
    var aggregated = Array.tabulate<Nat>(numSlots, func(i) = 0);
    
    // Compute the sum of preferences for each time slot
    // Only consider slots where everyone is available (preference > 0)
    for (userPrefs in preferences.vals()) {
      for (i in Iter.range(0, numSlots - 1)) {
        if (userPrefs[i] > 0) {
          aggregated[i] += userPrefs[i];
        } else {
          // If any user is unavailable, set preference to 0
          aggregated[i] := 0;
        };
      };
    };
    
    // Find the slot with the highest aggregate preference
    var bestSlot: ?Nat = null;
    var maxPreference: Nat = 0;
    
    for (i in Iter.range(0, numSlots - 1)) {
      if (aggregated[i] > maxPreference) {
        maxPreference := aggregated[i];
        bestSlot := ?i;
      };
    };
    
    return bestSlot;
  };
}

