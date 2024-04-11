import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

const ID_VALIDATION_ERROR_MESSAGE = `A provided ID isn't correct`;

export const SafeMongoIdTransform = ({ value }) => {
  try {
    if (
      Types.ObjectId.isValid(value) &&
      new Types.ObjectId(value).toString() === value
    ) {
      return value;
    }

    throw new BadRequestException(ID_VALIDATION_ERROR_MESSAGE);
  } catch (error) {
    throw new BadRequestException(ID_VALIDATION_ERROR_MESSAGE);
  }
};
