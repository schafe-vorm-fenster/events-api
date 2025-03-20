import { initContract } from "@ts-rest/core";
import { TriggerUpdateCalendarContract } from "./calendars/[id]/trigger-update-calendar.contract";
import { TriggerUpdateAllContract } from "./calendars/all/trigger-update-all.contract";

const c = initContract();

export const UpdateContract = c.router({
  ...TriggerUpdateCalendarContract,
  ...TriggerUpdateAllContract,
});
