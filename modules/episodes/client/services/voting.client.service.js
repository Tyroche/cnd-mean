(function () {
  'use strict';

  angular
    .module('episodes')
    .factory('ContractVotingService', ContractVotingService);

  ContractVotingService.$inject = [
    'ContractsService'
  ];

  function ContractVotingService(contractService) {
    // Check to see if a user is playing in an episode
    function isUserPlayingInEpisode(episode, user) {
      return episode.attendees.indexOf(user._id) > -1;
    }

    function isUserAttendancePermitted(user) {
      return user.roles.indexOf('consultant') > -1 || user.roles.indexOf('admin') > -1;
    }

    function enableAttendance(episode, user, character ) {
      if(!isUserAttendancePermitted(user)) { return; }
      episode.attendees.push({
        user: user._id,
        character: character._id
      });
      episode.$update();
    }

    function disableAttendance(episode, user, character, contracts) {
      var attendanceIndex = episode.attendees.indexOf({
        user: user._id,
        character: character._id
      });

      if (attendanceIndex > -1) {
        episode.attendees.splice(attendanceIndex, 1);
        removeVote(contracts, user);
        episode.$update();
      }
    }

    function removeVote(contracts, user) {
      var previouslyVoted = getPlayerVotedContract(contracts, user);
      if (previouslyVoted) {
        previouslyVoted.voters.splice(previouslyVoted.voters.indexOf(user._id), 1);
        previouslyVoted.$update();
      }
    }

    function castVote(contracts, user, index) {
      removeVote(contracts, user);
      contracts[index].voters.push(user._id);
      contracts[index].$update();
    }


    function getPlayerVotedContract(contracts, user) {
      return contracts.filter(function (obj) {
        return obj.voters.indexOf(user._id) > -1;
      })[0];
    }

    // Public API
    return {
      isUserPlaying: function (episode, user) {
        return isUserPlayingInEpisode(episode, user);
      },

      toggleAttendance: function (episode, user, character, contracts) {
        if(isUserPlayingInEpisode(episode, user)) {
          disableAttendance(episode, user, character, contracts);
          return;
        }
        enableAttendance(episode, user, character);
      },

      voteForContract: function(episode, user, contracts, index) {
        if (isUserPlayingInEpisode(episode, user)) {
          castVote(contracts, user, index);
        }
      },

      getVotedContract: function(contracts, user) {
        return getPlayerVotedContract(contracts, user);
      },

      getHighestVotedContract: function(episode, contracts) {
        var episodeContracts = contracts.filter(function (obj) {
          return episode.contracts.indexOf(obj._id) > -1;
        });

        if (!episodeContracts) { return 'No contracts yet'; }
        if (episodeContracts.filter(function (obj) { return !obj.voters; }).length > 0) {
          return 'No votes cast';
        }

        var maximum = episodeContracts.sort(function (a, b) {
          return b.voters.length - a.voters.length;
        })[0];

        return maximum ? maximum.name : 'No votes cast';
      }
    };
  }
})();
