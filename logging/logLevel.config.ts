import { Level } from "pino";
import { api, client } from "./loggerApps.config";

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
    level: "debug",
  },
  {
    app: api.languages.get,
    level: "debug",
  },
  {
    app: api.schema.get,
    level: "debug",
  },
  {
    app: client.classification.bytag,
    level: "debug",
  },
  {
    app: client.geocode.findbyaddress,
    level: "debug",
  },
];
