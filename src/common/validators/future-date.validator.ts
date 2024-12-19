import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'futureDateValidator', async: false })
export class FutureDateValidator implements ValidatorConstraintInterface {
  validate(date: Date) {
    return date instanceof Date && date > new Date();
  }

  defaultMessage() {
    return 'Date must be in the future';
  }
}
