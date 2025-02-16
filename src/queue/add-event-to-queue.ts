import { CloudTasksClient } from "@google-cloud/tasks";
import { GoogleEvent } from "../events/google-event.types";
import { Task } from "./queue.types";

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
  if (!event) throw new Error("Event is required");

  // define constants

  const projectId: string = process.env.GOOGLEAPI_PROJECT_ID!;
  const location: string = process.env.GOOGLEAPI_LOCATION!;
  const queue: string = process.env.GOOGLEAPI_TASKS_QUEUE_NAME!;
  const url: string =
    "https://translation.api.schafe-vorm-fenster.de/api/translate";

  // Construct the fully qualified queue name.
  // Example: projects/PROJECT_ID/locations/LOCATION/queues/QUEUE_NAME
  const parent = client.queuePath(projectId, location, queue);

  // Build the task object.
  const task: any = {
    httpRequest: {
      httpMethod: "POST",
      url,
      headers: {
        "Content-Type": "application/json",
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
    // get last tghree segments from "projects/schafe-vorm-fenster/locations/europe-west3/queues/incoming-events/tasks/3436979078631171913" so that it becomes "/incoming-events/tasks/9166206631063672756"
    const queueTaskId = response.name!.split("/").slice(-3).join("/");
    console.log(`Task created: ${response.name}`);
    console.log(`Task payload: ${JSON.stringify(response)}`);
    return {
      queueTaskId: queueTaskId,
      eventID: event.id!,
    };
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}
