import {join} from "path";
import {loggerConfig} from "./logger";
import typeormConfig from "./typeorm";

export const rootDir = join(__dirname, "..");

export const config: Partial<TsED.Configuration> = {
  rootDir,
  logger: loggerConfig,
  typeorm: typeormConfig,
  // additional shared configuration
};
