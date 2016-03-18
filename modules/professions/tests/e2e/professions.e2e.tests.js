'use strict';

describe('Professions E2E Tests:', function () {
  describe('Test Professions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/professions');
      expect(element.all(by.repeater('profession in professions')).count()).toEqual(0);
    });
  });
});
