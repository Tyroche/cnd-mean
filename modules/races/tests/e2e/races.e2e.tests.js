'use strict';

describe('Races E2E Tests:', function () {
  describe('Test Races page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/races');
      expect(element.all(by.repeater('race in races')).count()).toEqual(0);
    });
  });
});
