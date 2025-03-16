import { ValidationOptions, registerDecorator } from 'class-validator';
import moment from 'moment';

function isValidDateFormat(value: Date): boolean {
  if (!(value instanceof Date)) {
    return false;
  }

  const dateFormat = 'YYYY-MM-DD';
  const momentDate = moment(value, dateFormat, true);

  return momentDate.isValid() && momentDate.isAfter(moment());
}

export function IsDateFormat(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isDateFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: Date) {
          return isValidDateFormat(value);
        },
      },
    });
  };
}
