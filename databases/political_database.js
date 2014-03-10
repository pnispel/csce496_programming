var mysql = require('mysql');
var Model = require('../src/model');
var Table = require('../src/table');

var database = mysql.createConnection({
  host     : 'cig-production.unl.edu',
  user     : 'historyharvest',
  password : 'history', 
  database : 'political'
});

database.connect();

var CandidateModel, CountyModel, ElectionModel, FusionLinkModel, FusionLinkStatesModel, LinkModel, OfficeCodeModel, PartyCodeModel, VoteModel, VoteRedundancyErrorsModel, VoteTallyErrorsModel;

var Candidates, Elections, Votes;

(function createPartyCodes () {
  // create model for contracts
  PartyCodeModel = function () {
    Model.call(this);

    this.attrs = PartyCodeModel.attrs;
    this.relationships = PartyCodeModel.relationships;
    this.table = PartyCodeModel.table;
  };

  PartyCodeModel.prototype = Object.create( Model.prototype );
  PartyCodeModel.table = 'party_code';

  // PartyCodes = new Table( database, PartyCodeModel );
})();

(function createOfficeCodes () {
  // create model for contracts
  OfficeCodeModel = function () {
    Model.call(this);

    this.attrs = OfficeCodeModel.attrs;
    this.relationships = OfficeCodeModel.relationships;
    this.table = OfficeCodeModel.table;
  };

  OfficeCodeModel.prototype = Object.create( Model.prototype );
  OfficeCodeModel.table = 'office_code';

  // OfficeCodes = new Table( database, OfficeCodeModel );
})();

(function createFusionLinkStates () {
  // create model for contracts
  FusionLinkStatesModel = function () {
    Model.call(this);

    this.attrs = FusionLinkStatesModel.attrs;
    this.relationships = FusionLinkStatesModel.relationships;
    this.table = FusionLinkStatesModel.table;
  };

  FusionLinkStatesModel.prototype = Object.create( Model.prototype );
  FusionLinkStatesModel.table = 'fusion_link_states';
})();

(function createCounties () {
  // create model for contracts
  CountyModel = function () {
    Model.call(this);

    this.attrs = CountyModel.attrs;
    this.relationships = CountyModel.relationships;
    this.table = CountyModel.table;
  };

  CountyModel.prototype = Object.create( Model.prototype );
  CountyModel.table = 'county';

  Counties = new Table( database, CountyModel );
})();

(function createCandidates () {
  // create model for contracts
  CandidateModel = function () {
    Model.call(this);

    this.attrs = CandidateModel.attrs;
    this.relationships = CandidateModel.relationships;
    this.table = CandidateModel.table;
  };

  CandidateModel.prototype = Object.create( Model.prototype );
  CandidateModel.table = 'candidate';
  CandidateModel.relationships = [
    {
      model: OfficeCodeModel, 
      key: 'office_code',
      to: 'office_code'
    },
    {
      model: PartyCodeModel, 
      key: 'party_code',
      to: 'partycode'
    },
    {
      model: CountyModel, 
      key: 'state_code',
      to: 'state_code'
    }
  ];

  Candidates = new Table( database, CandidateModel );
})();

(function createElections () {
  // create model for contracts
  ElectionModel = function () {
    Model.call(this);

    this.attrs = ElectionModel.attrs;
    this.relationships = ElectionModel.relationships;
    this.table = ElectionModel.table;
  };

  ElectionModel.prototype = Object.create( Model.prototype );
  ElectionModel.table = 'election';
  ElectionModel.relationships = [
    {
      model: FusionLinkStatesModel, 
      key: 'state_id',
      to: 'fusion_state_id'
    }
  ];

  Elections = new Table( database, ElectionModel );
})();

(function createVotes () {
  // create model for contracts
  VoteModel = function () {
    Model.call(this);

    this.attrs = VoteModel.attrs;
    this.relationships = VoteModel.relationships;
    this.table = VoteModel.table;
  };

  VoteModel.prototype = Object.create( Model.prototype );
  VoteModel.table = 'vote';
  VoteModel.relationships = [
    {
      model: ElectionModel, 
      key: 'election_id',
      to: 'election_id'
    }
  ];

  Votes = new Table( database, VoteModel );
})();

module.exports = {
  database: database,
  end: function() { database.end(); return this; },

  Candidates: Candidates,
  Elections: Elections,
  Votes: Votes
};