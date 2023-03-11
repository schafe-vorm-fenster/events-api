"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfJsonObject = void 0;
/**
 * check if input is a json object
 * @param obj
 * @returns boolean
 */
const checkIfJsonObject = (obj) => {
    if (obj === undefined || obj === null || obj.constructor != Object)
        throw new Error("input is not a json object");
    if (Object.keys(obj).length === 0)
        throw new Error("object is empty ");
    return true;
};
exports.checkIfJsonObject = checkIfJsonObject;
