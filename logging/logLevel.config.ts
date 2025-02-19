import { Level } from "pino";
import { apiLogger, clientLogger } from "./loggerApps.config";

interface LogLevelConfig {
  app: string;
  level: Level;
}

export const logLevelConfig: LogLevelConfig[] = [
  {
    app: "*",
    level: "debug",
  },
  {
    app: apiLogger.events.post,
    level: "debug",
  },
  {
    app: apiLogger.events.community,
    level: "debug",
  },
  {
    app: apiLogger.events.scope,
    level: "debug",
  },
  {
    app: apiLogger.events.category,
    level: "debug",
  },
  {
    app: apiLogger.categories.get,
    level: "debug",
  },
  {
    app: apiLogger.languages.get,
    level: "debug",
  },
  {
    app: apiLogger.schema.get,
    level: "debug",
  },
  {
    app: clientLogger.classification.bytag,
    level: "debug",
  },
  {
    app: clientLogger.geocode.findbyaddress,
    level: "debug",
  },
];
