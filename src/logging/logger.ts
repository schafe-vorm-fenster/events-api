import pino, { Level, Logger } from "pino";
import { logLevelConfig } from "./logLevel.config";

/**
 * Gets log level based on logger name from config.
 * @param logger
 * @returns
 */
function getLogLevel(logger: string): Level {
  return (
    logLevelConfig.find((logLevel) => logLevel.app === logger)?.level ||
    logLevelConfig.find((logLevel) => logLevel.app === "*")?.level ||
    "info"
  );
}

export function getLogger(name: string): Logger {
  return pino({ name, level: getLogLevel(name) });
}
