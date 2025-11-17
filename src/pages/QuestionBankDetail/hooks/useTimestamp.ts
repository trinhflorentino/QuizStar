export const getTimestampValue = (value: any): number => {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (value.seconds) return value.seconds * 1000;
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const formatTimestamp = (value: any): string => {
  const time = getTimestampValue(value);
  if (!time) return "—";
  return new Date(time).toLocaleString();
};




