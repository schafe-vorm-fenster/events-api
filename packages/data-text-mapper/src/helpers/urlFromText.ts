const urlRegexSafe = require("url-regex-safe");

const urlRegex = urlRegexSafe();

const urlFromText = (text: string): string | null => {
  const matches = text.match(urlRegex);
  if (matches && matches?.length > 0) return matches[0];
  return null;
};

const removeUrlFromText = (text: string): string => {
  const regExp = new RegExp(urlRegex);
  const reducedText: string = text.replace(regExp, "").trim();
  return reducedText;
};

export { urlFromText, removeUrlFromText, urlRegex };
