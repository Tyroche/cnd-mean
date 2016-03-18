'use strict';

describe('Feats E2E Tests:', function () {
  describe('Test Feats page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/feats');
      expect(element.all(by.repeater('feat in feats')).count()).toEqual(0);
    });
  });
});
