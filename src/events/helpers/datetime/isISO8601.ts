export const isISO8601 = (date: string): boolean => {
  var ISO8601 = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;
  if (date.match(ISO8601)) {
    return true;
  } else {
    return false;
  }
};
