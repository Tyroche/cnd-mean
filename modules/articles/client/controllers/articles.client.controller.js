'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
  function ($scope, $stateParams, $location, Authentication, Articles) {
    $scope.maxSummaryLength = 150;
    $scope.authentication = Authentication;

    $scope.smallDescription = function(description) {
      var small = description.split(' ').reduce(function(prev, cur) {
        return prev.length < $scope.maxSummaryLength ? prev + ' ' + cur : prev;
      }, '').trim();

      return small.length < description.length ? small + '...' : description;
    };

    $scope.isAdmin = function() {
      return Authentication.user.roles.indexOf('admin') > -1;
    };

    // Create new Article
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');
        return false;
      }

      // Create new Article object
      var article = new Articles({
        title: this.title,
        content: this.content,
        author: this.author
      });

      // Redirect after save
      article.$save(function (response) {
        $location.path('news/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
        $scope.author = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };


    // Remove existing Article
    $scope.remove = function (article) {
      if (article) {
        article.$remove();

        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function () {
          $location.path('articles');
        });
      }
    };

    // Update existing Article
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      var article = $scope.article;

      article.$update(function () {
        $location.path('news/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Articles
    $scope.find = function () {
      $scope.articles = Articles.query();
    };

    // Find existing Article
    $scope.findOne = function () {
      $scope.article = Articles.get({
        articleId: $stateParams.articleId
      });
    };
  }
]);
