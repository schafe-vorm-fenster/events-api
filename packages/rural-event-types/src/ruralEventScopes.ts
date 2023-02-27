export type RuralEventScope =
  | "community"
  | "municipality"
  | "county"
  | "state"
  | "country"
  | "global"
  | "neighborhood" // nearby the current location approximately 5-7km
  | "region"; // in the greater region of the current location approximately 20-30km
