const { validateId, validateLoginPayload } = require('../../src/utils/validators');
const HttpError = require('../../src/utils/HttpError');

describe('Validators Unit Tests', () => {
  describe('validateId', () => {
    it('should return parsed integer for valid numeric string', () => {
      expect(validateId('123')).toBe(123);
    });

    it('should throw HttpError for invalid id', () => {
      expect(() => validateId('abc')).toThrow(HttpError);
      expect(() => validateId('-1')).toThrow(HttpError);
    });
  });

  describe('validateLoginPayload', () => {
    it('should return payload if username and password are provided', () => {
      const payload = { username: 'admin', password: 'password123' };
      expect(validateLoginPayload(payload)).toEqual(payload);
    });

    it('should throw HttpError if username is missing', () => {
      expect(() => validateLoginPayload({ password: '123' })).toThrow(HttpError);
    });
  });
});
