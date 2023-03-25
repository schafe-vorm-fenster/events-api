// strip strange characters or linebreaks from content
export const cleanCharset = (content: string): string => {
  let cleanContent: string = content || "";
  const regex = /[\u2028|\u2029]/g;
  cleanContent = cleanContent.replaceAll(regex, "");
  return cleanContent;
};
