import { UrlValidator } from '@/core/validation/validators';

describe('UrlValidator.validate should', () => {
    describe('return false when passing in', () => {
        test('http://', () => {
            expect(UrlValidator.validate('http')).toBeFalsy();
        });
        test('https://', () => {
            expect(UrlValidator.validate('http://')).toBeFalsy();
        });
        test('https://foo', () => {
            expect(UrlValidator.validate('https://q')).toBeFalsy();
        });
        test('https://foo..', () => {
            expect(UrlValidator.validate('https://foo..')).toBeFalsy();
        });
        test('https://foo.-', () => {
            expect(UrlValidator.validate('https://foo.-')).toBeFalsy();
        });
        test('https://foo--', () => {
            expect(UrlValidator.validate('https://foo--')).toBeFalsy();
        });
        test('https://192.0.0', () => {
            expect(UrlValidator.validate('https://192.0.0')).toBeFalsy();
        });
        test('https://goo_gle.com', () => {
            expect(UrlValidator.validate('https://goo_gle.com')).toBeFalsy();
        });
        test('localhost', () => {
            expect(UrlValidator.validate('localhost')).toBeFalsy();
        });
    });
    describe('return true when passing in', () => {
        test('google.com', () => {
            expect(UrlValidator.validate('google.com')).toBeTruthy();
        });
        test('http://google.com', () => {
            expect(UrlValidator.validate('http://google.com')).toBeTruthy();
        });
        test('https://google.com', () => {
            expect(UrlValidator.validate('https://google.com')).toBeTruthy();
        });
        test('https://goo-gle.com', () => {
            expect(UrlValidator.validate('https://goo-gle.com')).toBeTruthy();
        });
        test('https://goo.gle.com', () => {
            expect(UrlValidator.validate('https://goo.gle.com')).toBeTruthy();
        });
        test('192.0.0.1:8080', () => {
            expect(UrlValidator.validate('192.0.0.1:8080')).toBeTruthy();
        });
        test('localhost:8080', () => {
            expect(UrlValidator.validate('localhost:8080')).toBeTruthy();
        });
        test('http://api-01.eu-west-1.0941-v1.symboldev.network:3000', () => {
            expect(UrlValidator.validate('http://api-01.eu-west-1.0941-v1.symboldev.network:3000')).toBeTruthy();
        });
    });
});
