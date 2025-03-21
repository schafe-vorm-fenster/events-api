import { CalendarQueueTask } from "./queue.types";
import { getLogger } from "@/src/logging/logger";
import { ClientGoogleTasks } from "@/src/logging/loggerApps.config";
import { SingleCalendarUpdateBody } from "../app/api/update/calendars/single/trigger-update-calendar.schema";
import { GoogleAuth } from "google-auth-library";

/**
 * Adds a new task to a Google Cloud Tasks queue using direct HTTP API.
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
  const targetUrl: string = new URL(
    "/api/update/calendars/single",
    process.env.SVF_EVENTSAPI_URL
  ).toString();

  // Create the base64 encoded payload
  const base64Body = Buffer.from(JSON.stringify(taskBody)).toString("base64");

  // Build the task object for the API
  const task = {
    httpRequest: {
      httpMethod: "POST",
      url: targetUrl,
      headers: {
        "Content-Type": "application/json",
        "Sheep-Token": process.env.WRITE_ACCESS_TOKENS,
      },
      body: base64Body,
    },
  };

  // Google Cloud Tasks API endpoint
  const apiUrl = `https://cloudtasks.googleapis.com/v2/projects/${projectId}/locations/${location}/queues/${queue}/tasks`;

  try {
    // Get a Google Auth token for the API request
    const accessToken = await getGoogleAuthToken();

    // Make the API request
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to create task: ${response.status} ${errorData}`);
    }

    const responseData = await response.json();

    // Extract the task ID from the name field (same format as before)
    const queueTaskId = responseData.name.split("/").slice(-3).join("/");

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

/**
 * Gets a Google Auth token for authenticating with the Cloud Tasks API
 * Using google-auth-library for proper authentication
 */
async function getGoogleAuthToken(): Promise<string> {
  try {
    // Create a new GoogleAuth instance using environment variables
    const auth = new GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLEAPI_CLIENT_EMAIL,
        private_key: process.env.GOOGLEAPI_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    // Get an access token
    const client = await auth.getClient();
    const token = await client.getAccessToken();

    if (!token.token) {
      throw new Error("Failed to obtain access token");
    }

    return token.token;
  } catch (error) {
    console.error("Error getting authentication token:", error);
    throw error;
  }
}
