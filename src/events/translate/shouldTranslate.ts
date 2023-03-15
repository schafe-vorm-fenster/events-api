import { OrganizerOptions, OrganizerUuid } from "../organizer/organizer.types";

interface ShouldTranslateParameters {
  organizerUuid: OrganizerUuid;
}

const shouldTranslate = (organizerOptions: OrganizerOptions): boolean => {
  return true;
};
