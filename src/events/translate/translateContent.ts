import axios from "axios";
import { getLogger } from "../../../logging/logger";
import { client } from "../../../logging/loggerApps.config";

export interface Content {
  title: string;
  content: string;
  tags?: string[];
}

export interface Translation {
  language: string; // ISO 639-1
  title: string;
  text: string;
  tags?: string[];
}

export interface TranslatedContents {
  translations: Translation[];
}

export const translateContent = async (
  title: string,
  body: string
): Promise<TranslatedContents | null> => {
  const log = getLogger(client.translation.translate);

  // check incoming data
  if (!title || title.length === 0) {
    log.error("no title given");
    return null;
  }

  // check env vars
  if (
    !process.env.SVF_TRANSLATIONAPI_HOST ||
    process.env.SVF_TRANSLATIONAPI_HOST.length <= 1
  ) {
    log.error("SVF_TRANSLATIONAPI_HOST is not set");
    return null;
  }
  if (
    !process.env.SVF_TRANSLATIONAPI_TOKEN ||
    process.env.SVF_TRANSLATIONAPI_TOKEN.length <= 1
  ) {
    log.error("SVF_TRANSLATIONAPI_TOKEN is not set");
    return null;
  }

  // translate by using the translation api with axios get at SVF_TRANSLATIONAPI_HOST
  const url: string = process.env.SVF_TRANSLATIONAPI_HOST + "api/translate";

  // send title and description to translation api
  return await axios
    .post(
      url,
      {
        title: title,
        text: body || "",
      },
      {
        headers: {
          "Sheep-Token": process.env.SVF_TRANSLATIONAPI_TOKEN,
          Accept: "application/json",
        },
      }
    )
    .then((response) => {
      const translations: TranslatedContents =
        response.data as TranslatedContents;

      // check response body for valid classification or delete to error handling
      if (
        !translations ||
        !translations.translations ||
        translations.translations.length === 0 ||
        !translations.translations[0].language
      )
        throw new Error("Translation failed with no/invalid result.");

      log.debug(
        {
          query: { title: title, body: body },
          translations: translations.translations,
        },
        "Successfully translated."
      );
      return response.data as TranslatedContents;
    })
    .catch((error) => {
      log.error(
        { query: { title: title, body: body }, error: error },
        "Translation error."
      );
      return null;
    });
};
