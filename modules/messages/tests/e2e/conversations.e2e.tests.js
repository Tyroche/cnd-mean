'use strict';

describe('Conversations E2E Tests:', function () {
  describe('Test Conversations page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/conversations');
      expect(element.all(by.repeater('conversation in conversations')).count()).toEqual(0);
    });
  });
});
