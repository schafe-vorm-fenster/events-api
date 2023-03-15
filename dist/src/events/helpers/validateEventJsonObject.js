"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEventJsonObject = void 0;
/**
 * validate event json object against minimal requirements
 * @param eventJson
 * @returns boolean
 */
const validateEventJsonObject = (eventJson) => {
    const errors = [];
    if (!eventJson.summary)
        errors.push("summary is required");
    // TODO: description can be empty, but maybe log a warning?
    // TODO: add more checks
    if (errors.length > 0)
        throw new Error(errors.join(", "));
    return true;
};
exports.validateEventJsonObject = validateEventJsonObject;
