export interface Content {
  title: string;
  body: string;
}

export interface TranslatedContent {
  de: Content;
  en: Content;
  pl: Content;
  uk: Content;
  ru: Content;
}

export const translateContent = async (
  title: string,
  body: string
): Promise<TranslatedContent> => {
  // TODO: send title and description to translation api
  // TODO: add/replace translated tags and scopes separately by constants
  return {
    de: {
      title: title,
      body: body,
    },
    en: {
      title: "EN:" + title,
      body: "EN:" + body,
    },
    pl: {
      title: "PL:" + title,
      body: "PL:" + body,
    },
    uk: {
      title: "UK:" + title,
      body: "UK:" + body,
    },
    ru: {
      title: "RU:" + title,
      body: "RU:" + body,
    },
  };
};
