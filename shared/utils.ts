export const addSecondsToDate = (seconds: number, date?: Date): Date => {
  const currentDate = date ? date : new Date();
  const updatedDate = new Date(currentDate.getTime() + seconds * 1000);

  return updatedDate;
};

export const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));
