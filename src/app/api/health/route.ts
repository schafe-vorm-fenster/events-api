// next js app router GET api route handler

import { createNextHandler } from "@ts-rest/serverless/next";
import { HealthContract } from "./health.contract";
import packageJson from "../../../../package.json" assert { type: "json" };
import {
  HealthyApiStatusSchema,
  UnhealthyApiStatusSchema,
} from "@/src/rest/health.schema";

const handler = createNextHandler(
  HealthContract,
  {
    health: async () => {

      // evaluate overall status code
      let status: number = 200;
      

      if (status === 200) {
        const apiStatus: HealthyApiStatusSchema = {
          status: status,
          version: packageJson.version,
          name: packageJson.name,
          description: packageJson.description,
          services: [],
        };
        return { status: 200, body: apiStatus };
      }

      const apiStatus: UnhealthyApiStatusSchema = {
        status: 503,
        error:"Unknown error",
        version: packageJson.version,
        name: packageJson.name,
        description: packageJson.description,
        services: [],
      };
      return { status: 503, body: apiStatus };
    },
  },

  {
    handlerType: "app-router",
  }
);

export { handler as GET };
