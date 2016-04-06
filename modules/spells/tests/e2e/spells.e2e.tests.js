'use strict';

describe('Spells E2E Tests:', function () {
  describe('Test Spells page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/spells');
      expect(element.all(by.repeater('spell in spells')).count()).toEqual(0);
    });
  });
});
