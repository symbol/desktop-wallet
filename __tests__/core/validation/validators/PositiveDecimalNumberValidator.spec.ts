import { appConfig } from '@/config';
import { PositiveDecimalNumberValidator } from '@/core/validation/validators/PositiveDecimalNumberValidator';

fdescribe('PositiveDecimalNumberValidator', () => {
    beforeAll(() => {
        appConfig.constants.DECIMAL_SEPARATOR = '.';
    });

    ['1', '   1    ', '1.1', '   123.456   ', '123.'].forEach((validValue) => {
        test(`'${validValue}' is valid`, () => {
            const isValid = PositiveDecimalNumberValidator.validate(validValue);
            expect(isValid).toBe(true);
        });
    });

    ['-1', '   -1    ', '1,1', '   123,456   ', '-123,456', 'hallo', '123.456.789', 'hallo 123'].forEach((invalidValue) => {
        test(`'${invalidValue}' is invalid`, () => {
            const isValid = PositiveDecimalNumberValidator.validate(invalidValue);
            expect(isValid).toBe(false);
        });
    });
});
