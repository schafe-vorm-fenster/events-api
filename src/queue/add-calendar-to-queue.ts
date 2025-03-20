import { CloudTasksClient } from "@google-cloud/tasks";
import { CalendarQueueTask } from "./queue.types";
import { getLogger } from "@/src/logging/logger";
import { ClientGoogleTasks } from "@/src/logging/loggerApps.config";
import { SingleCalendarUpdateBody } from "../app/api/update/calendars/single/trigger-update-calendar.schema";

// Instantiate a Cloud Tasks client.
const client = new CloudTasksClient({
  credentials: {
    client_email: process.env.GOOGLEAPI_CLIENT_EMAIL,
    private_key: process.env.GOOGLEAPI_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

/**
 * Adds a new task to a Google Cloud Tasks queue.
 */
export async function addCalendarToQueue(
  calendarId: string,
  after?: string,
  before?: string,
  updatedSince?: string
): Promise<CalendarQueueTask> {
  const log = getLogger(ClientGoogleTasks.add);

  if (!calendarId) throw new Error("Calendar id is required");

  // build task body
  const taskBody: SingleCalendarUpdateBody = {
    id: calendarId,
    after: after,
    before: before,
    updatedSince: updatedSince,
  };

  // define constants by env vars
  const projectId: string = process.env.GOOGLEAPI_PROJECT_ID!;
  const location: string = process.env.GOOGLEAPI_LOCATION!;
  const queue: string = process.env.GOOGLEAPI_TASKS_CALENDARS_QUEUE_NAME!;
  const url: string = new URL(
    "/api/update/calendars/single",
    process.env.SVF_EVENTSAPI_URL
  ).toString();

  // Construct the fully qualified queue name.
  const parent = client.queuePath(projectId, location, queue);

  // Build the task object.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const task: any = {
    httpRequest: {
      httpMethod: "POST",
      url,
      headers: {
        "Content-Type": "application/json",
        "Sheep-Token": process.env.WRITE_ACCESS_TOKENS,
      },
    },
  };

  // If a payload is provided, encode it to base64.
  const body = Buffer.from(JSON.stringify(taskBody)).toString("base64");
  task.httpRequest.body = body;

  // Create the task in the specified queue.
  try {
    // get typed response from client.createTask
    const [response] = await client.createTask({ parent, task });
    // get last three segments from "projects/schafe-vorm-fenster/locations/europe-west3/queues/incoming-events/tasks/3436979078631171913" so that it becomes "/incoming-events/tasks/9166206631063672756"
    const queueTaskId = response.name!.split("/").slice(-3).join("/");

    const createTaskResult: CalendarQueueTask = {
      queueTaskId: queueTaskId,
      calendarID: calendarId,
    };
    log.info("Task created", createTaskResult);

    return createTaskResult;
  } catch (error) {
    log.error("Error creating task:", error);
    throw error;
  }
}
