import { CloudTasksClient } from "@google-cloud/tasks";
import { GoogleEvent } from "../events/types/google-event.types";
import { Task } from "./queue.types";
import { getLogger } from "@/logging/logger";
import { clientLogger } from "@/logging/loggerApps.config";

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
export async function addEventToQueue(event: GoogleEvent): Promise<Task> {
  const log = getLogger(clientLogger.googletasks.add);

  if (!event) throw new Error("Event is required");

  // define constants by env vars
  const projectId: string = process.env.GOOGLEAPI_PROJECT_ID!;
  const location: string = process.env.GOOGLEAPI_LOCATION!;
  const queue: string = process.env.GOOGLEAPI_TASKS_QUEUE_NAME!;
  const url: string = process.env.SVF_EVENTSAPI_URL + "/api/queue";

  // Construct the fully qualified queue name.
  // Example: projects/PROJECT_ID/locations/LOCATION/queues/QUEUE_NAME
  const parent = client.queuePath(projectId, location, queue);

  // Build the task object.
  // TODO: add typing
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
  const body = Buffer.from(JSON.stringify(event)).toString("base64");
  task.httpRequest.body = body;

  // Create the task in the specified queue.
  try {
    // get typed response from client.createTask
    const [response] = await client.createTask({ parent, task });
    // get last three segments from "projects/schafe-vorm-fenster/locations/europe-west3/queues/incoming-events/tasks/3436979078631171913" so that it becomes "/incoming-events/tasks/9166206631063672756"
    const queueTaskId = response.name!.split("/").slice(-3).join("/");

    const createTaskResult: Task = {
      queueTaskId: queueTaskId,
      eventID: event.id!,
    };
    log.info("Task created", createTaskResult);

    return createTaskResult;
  } catch (error) {
    log.error("Error creating task:", error);
    throw error;
  }
}
