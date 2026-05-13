/**
 * Cast Express query/param value (string | string[] | ParsedQs) to string safely.
 * Express types req.query values as string | string[] | ParsedQs but in practice
 * they are strings when coming from URL params/simple query strings.
 */
export const asStr = (val: any): string => (Array.isArray(val) ? val[0] : val) as string;

export const asInt = (val: any, fallback = 0): number => {
  const n = parseInt(asStr(val));
  return isNaN(n) ? fallback : n;
};

export const asFloat = (val: any, fallback = 0): number => {
  const n = parseFloat(asStr(val));
  return isNaN(n) ? fallback : n;
};
