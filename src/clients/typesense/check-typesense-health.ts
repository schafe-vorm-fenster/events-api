import {
  HealthyServiceInfoSchema,
  ServiceStatusSchema,
  UnhealthyServiceInfoSchema,
} from "@/src/rest/health.schema";
import client from "./search/client";

export const checkTypesenseHealth = async (): Promise<ServiceStatusSchema> => {
  const serviceName: string = "search-engine";
  try {
    // check health
    const status = (await client.health.retrieve()) as { ok?: boolean };
    if (!status || typeof status !== "object" || status.ok !== true) {
      throw new Error("Search engine is not healthy");
    }

    // get version

    const version = (await client.debug.retrieve()) as { version?: string };
    if (!version || typeof version !== "object" || !version.version) {
      throw new Error("Search engine version is not available");
    }

    const serviceInfo: HealthyServiceInfoSchema = {
      status: 200,
      message: "healthy",
      name: serviceName,
      version: version.version ?? "unknown",
    };
    return serviceInfo;
  } catch (error) {
    console.error(error);

    const serviceInfo: UnhealthyServiceInfoSchema = {
      status: 503,
      error: (error instanceof Error
        ? error.message
        : "Unknown error") as string,
      name: serviceName,
      version: "unknown",
    };
    return serviceInfo;
  }
};
