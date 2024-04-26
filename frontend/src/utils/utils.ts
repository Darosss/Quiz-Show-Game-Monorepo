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
  if (milliseconds < 0) return ``;
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

export const prettierCamelCaseName = (name: string): string => {
  if (!name.trim()) {
    return name;
  } else if (name.toUpperCase() === name) {
    return name;
  }

  const trimmedName = name.trim();

  const parts = trimmedName.split(/(?=[A-Z])/g);

  return parts.reduce((camelCase, part, index) => {
    // Always capitalize the first part or any part after a lowercase character
    return (
      camelCase +
      (index === 0 || part[0].toLowerCase() === part[0]
        ? part[0].toUpperCase()
        : part[0]) +
      part.slice(1) +
      " "
    );
  }, "");
};
