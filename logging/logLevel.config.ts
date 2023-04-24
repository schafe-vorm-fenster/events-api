import { Level } from "pino";
import { api } from "./loggerApps.config";

interface LogLevelConfig {
  app: string;
  level: Level;
}

export const logLevelConfig: LogLevelConfig[] = [
  {
    app: "*",
    level: "info",
  },
  {
    app: api.events.post,
    level: "debug",
  },
  {
    app: api.events.community,
    level: "debug",
  },
  {
    app: api.events.scope,
    level: "debug",
  },
  {
    app: api.events.category,
    level: "debug",
  },
  {
    app: api.categories.get,
    level: "info",
  },
  {
    app: api.languages.get,
    level: "info",
  },
  {
    app: api.schema.get,
    level: "info",
  },
];
