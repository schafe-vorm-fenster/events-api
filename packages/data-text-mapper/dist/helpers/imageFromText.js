const urlRegexSafe = require("url-regex-safe");
const urlRegex = urlRegexSafe();
const imageFromText = (text) => {
    const urlMatches = text.match(urlRegex);
    const imageRexExp = new RegExp(/\.(jpg|jpeg|png|gif|svg)/gi);
    let imageMatches = [];
    if (urlMatches && (urlMatches === null || urlMatches === void 0 ? void 0 : urlMatches.length) > 0)
        imageMatches = urlMatches.filter((url) => (url || "").match(imageRexExp));
    if (imageMatches && (imageMatches === null || imageMatches === void 0 ? void 0 : imageMatches.length) > 0)
        return imageMatches[0];
    return null;
};
const removeImageFromText = (text) => {
    const regExp = new RegExp(urlRegex);
    const reducedText = text.replace(regExp, "").trim();
    return reducedText;
};
export { imageFromText, removeImageFromText, urlRegex };
