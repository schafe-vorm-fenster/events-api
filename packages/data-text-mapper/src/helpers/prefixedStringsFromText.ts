const prefixedStringsRegex = (prefix: string): RegExp => {
  const regExpStr: string =
    "(" + prefix + ".*?<)|(" + prefix + ".*?\\s" + ")|(" + prefix + ".*?$)";
  return new RegExp(regExpStr, "g");
};

const prefixedStringsFromText = (
  text: string,
  prefix: string
): string[] | null => {
  const regExp = prefixedStringsRegex(prefix);
  const matches = text.match(regExp);

  if (matches && matches?.length > 0)
    return matches.map((tag) =>
      tag.replace(prefix, "").replace("<", "").trim()
    );

  return null;
};

const removePrefixedStringsFromText = (
  text: string,
  prefix: string
): string => {
  const regExp = prefixedStringsRegex(prefix);
  const reducedText: string = text.replace(regExp, "").trim();
  return reducedText;
};

export {
  prefixedStringsFromText,
  removePrefixedStringsFromText,
  prefixedStringsRegex,
};
