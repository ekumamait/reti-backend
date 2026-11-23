import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ParticipantDetailsDto } from './participant-details.dto';
import { ERROR_MESSAGES } from '../../common/constants';

const check = (nin: unknown) => {
  const instance = plainToInstance(ParticipantDetailsDto, {
    nin,
  }) as ParticipantDetailsDto;
  return {
    errors: validateSync(instance),
    nin: instance.nin,
  };
};

describe('ParticipantDetailsDto NIN validation', () => {
  it('accepts a well-formed 14-character NIN', () => {
    const { errors } = check('CM9104011234CF');
    expect(errors).toEqual([]);
  });

  it('normalises lowercase and whitespace before validating', () => {
    const { errors, nin } = check(' cm 9104011234cf ');
    expect(errors).toEqual([]);
    expect(nin).toBe('CM9104011234CF');
  });

  it('rejects a NIN with the wrong prefix', () => {
    const { errors } = check('XX9104011234CF');
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      matches: ERROR_MESSAGES.INVALID_NIN,
    });
  });

  it('skips validation when NIN is empty', () => {
    const { errors } = check('');
    expect(errors).toEqual([]);
  });
});
