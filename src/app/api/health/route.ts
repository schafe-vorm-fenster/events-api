// next js app router GET api route handler

import { createNextHandler } from "@ts-rest/serverless/next";
import { HealthContract } from "./health.contract";
import packageJson from "../../../../package.json" assert { type: "json" };
import {
  HealthyApiStatusSchema,
  ServiceStatusSchema,
  UnhealthyApiStatusSchema,
} from "@/src/rest/health.schema";
import { checkGeoApiHealth } from "@/src/clients/geo-api/check-geo-api-health";
import { checkClassificationApiHealth } from "@/src/clients/classification-api/classification-api-health";
import { checkTranslationApiHealth } from "@/src/clients/translation-api/check-translation-api-health";

const handler = createNextHandler(
  HealthContract,
  {
    health: async () => {
      // evaluate overall status code
      const status: number = 200;

      // check client services
      const geoApiStatus: ServiceStatusSchema = await checkGeoApiHealth();
      const classificationApiStatus: ServiceStatusSchema =
        await checkClassificationApiHealth();
      const translationApiStatus: ServiceStatusSchema =
        await checkTranslationApiHealth();

      if (status === 200) {
        const apiStatus: HealthyApiStatusSchema = {
          status: status,
          version: packageJson.version,
          name: packageJson.name,
          description: packageJson.description,
          services: [
            geoApiStatus,
            classificationApiStatus,
            translationApiStatus,
          ],
        };
        return { status: 200, body: apiStatus };
      }

      const apiStatus: UnhealthyApiStatusSchema = {
        status: 503,
        error: "Unknown error",
        version: packageJson.version,
        name: packageJson.name,
        description: packageJson.description,
        services: [],
      };
      return { status: 503, body: apiStatus };
    },
  },

  {
    jsonQuery: true,
    responseValidation: true,
    handlerType: "app-router",
  }
);

export { handler as GET };
