import { calendar_v3 } from "@googleapis/calendar";
import Schema$EventAttachment = calendar_v3.Schema$EventAttachment;
import Schema$EventDateTime = calendar_v3.Schema$EventDateTime;
import Schema$Event = calendar_v3.Schema$Event;

import { z } from "zod";
import { RFC3339 } from "../rest/rfc3339.types";
import { Timezone } from "../rest/timezone.types";

export const GoogleEventOrganizer = z.object({
  displayName: z.string().optional(),
  email: z.string().optional(),
  id: z.string().optional(),
  self: z.boolean().optional(),
});
export type GoogleEventOrganizer = z.infer<typeof GoogleEventOrganizer>;

export const GoogleEventDateTime = z.object({
  date: RFC3339.optional(),
  dateTime: RFC3339.optional(),
  timeZone: Timezone.optional(),
});
export type GoogleEventDateTime =
  | z.infer<typeof GoogleEventDateTime>
  | Schema$EventDateTime;

export const GoogleEventAttachment = z.object({
  fileId: z.string().optional(),
  fileUrl: z.string(),
  iconLink: z.string().optional(),
  mimeType: z.string().optional(),
  title: z.string().optional(),
});
export type GoogleEventAttachment =
  | z.infer<typeof GoogleEventAttachment>
  | Schema$EventAttachment;

export const GoogleEvent = z.object({
  // system
  id: z.string(),
  kind: z.literal("calendar#event").optional(),
  created: RFC3339.optional(),
  updated: RFC3339.optional(),
  status: z.string().optional(),
  // date
  start: GoogleEventDateTime,
  end: GoogleEventDateTime.optional(),
  sequence: z.number().optional(),
  attachments: z.array(GoogleEventAttachment).optional(),
  recurrence: z.array(z.string()).optional(),
  recurringEventId: z.string().optional(),
  // content
  summary: z.string(),
  description: z.string().optional(),
  location: z.string(),
  // context
  organizer: GoogleEventOrganizer.optional(),
});
export type GoogleEvent = z.infer<typeof GoogleEvent> | Schema$Event;
