'use strict';

describe('Backgrounds E2E Tests:', function () {
  describe('Test Backgrounds page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/backgrounds');
      expect(element.all(by.repeater('background in backgrounds')).count()).toEqual(0);
    });
  });
});
