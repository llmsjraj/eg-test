import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

interface IsPasswordStrongOptions {
  minLength: number;
}

@ValidatorConstraint({ async: false })
export class IsPasswordStrongConstraint
  implements ValidatorConstraintInterface
{
  validate(password: string, args: ValidationArguments) {
    if (password == null) {
      return false;
    }

    const options: IsPasswordStrongOptions = args.constraints[0] || {
      minLength: 8,
    };
    const minLength = options.minLength;

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    const isLengthValid = password.length >= minLength;

    return hasLetter && hasNumber && hasSpecialChar && isLengthValid;
  }

  defaultMessage(args: ValidationArguments) {
    const options: IsPasswordStrongOptions = args.constraints[0] || {
      minLength: 8,
    };
    const minLength = options.minLength;

    const password = args.value as string;
    const messages = [];

    if (password == null) {
      return 'Password should not be empty';
    }

    if (!/[a-zA-Z]/.test(password)) {
      messages.push('Contains at least 1 letter');
    }
    if (!/\d/.test(password)) {
      messages.push('Contains at least 1 number');
    }
    if (!/[@$!%*?&]/.test(password)) {
      messages.push('Contains at least 1 special character');
    }
    if (password.length < minLength) {
      messages.push(`Must be at least ${minLength} characters long`);
    }

    return messages.join('. ') + '.';
  }
}

export function IsPasswordStrong(
  options?: IsPasswordStrongOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isPasswordStrong',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options || { minLength: 8 }],
      validator: IsPasswordStrongConstraint,
    });
  };
}
