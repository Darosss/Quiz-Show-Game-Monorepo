import * as bcrypt from 'bcrypt';

export const hashString = async (stringToHash: string) => {
  const saltOrRounds = 10;

  const hashedString = await bcrypt.hash(stringToHash, saltOrRounds);

  return hashedString;
};

export const comparHashedString = async (
  stringToCompare: string,
  hashedString: string,
) => await bcrypt.compare(stringToCompare, hashedString);
