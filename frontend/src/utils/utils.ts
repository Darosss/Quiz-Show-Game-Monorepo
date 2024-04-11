type GetRemainingTimeFromDateToDateParams = {
  timestamp: number;
  toTimestamp: number;
};

export const getRemainingTimeFromDateToDate = ({
  timestamp,
  toTimestamp,
}: GetRemainingTimeFromDateToDateParams): number => {
  const timeleft = toTimestamp - timestamp;

  return timeleft;
};

export const formatTime = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const formattedDays = days > 0 ? days + "d" : "";
  const formattedHours = hours > 0 ? padWithZero(hours % 24) + ":" : "";
  const formattedMinutes = padWithZero(minutes % 60);
  const formattedSeconds = padWithZero(seconds % 60);

  return `${formattedDays} ${formattedHours}${formattedMinutes}:${formattedSeconds}`;
};

const padWithZero = (value: number) => {
  return value < 10 ? `0${value}` : value;
};
