'use strict';

describe('Wikis E2E Tests:', function () {
  describe('Test Wikis page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/wikis');
      expect(element.all(by.repeater('wiki in wikis')).count()).toEqual(0);
    });
  });
});
