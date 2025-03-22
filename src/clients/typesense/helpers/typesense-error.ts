import { TypesenseError } from "typesense/lib/Typesense/Errors";

// TODO: something is strange here, this function shpuld not be needed
export const isTypesenseError = (error: unknown, checks: string[]): boolean => {
  // case for a regular typesense error object
  if (error instanceof TypesenseError) {
    if (error.httpStatus && checks.includes(error.httpStatus.toString())) {
      return true;
    }

    // check if error.message is in checks
    if (error.message && checks.includes(error.message)) {
      return true;
    }
  }

  // case for a reduced typesense error object

  if (
    error instanceof Object &&
    Object.keys(error).find((key) => key === "name")
  ) {
    // check if error.name is in checks
    const errorWithName = error as { name: string };
    if (errorWithName.name && checks.includes(errorWithName.name)) {
      return true;
    }
  }
  return false;
};
