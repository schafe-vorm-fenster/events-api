/**
 * check if input is a json object
 * @param obj
 * @returns boolean
 */
export const checkIfJsonObject = (obj: any): boolean => {
  if (obj === undefined || obj === null || obj.constructor != Object)
    throw new Error("input is not a json object");
  if (Object.keys(obj).length === 0) throw new Error("object is empty ");
  return true;
};
