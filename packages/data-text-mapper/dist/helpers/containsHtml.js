const containsHtml = (text) => {
    const matchTags = new RegExp("(<.*>.*</.*>)|(<.*/>)", "gi");
    const matches = text.match(matchTags);
    return matches ? true : false;
};
export { containsHtml };
