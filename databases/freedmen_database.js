var mysql = require('mysql');
var Model = require('../src/model');
var Table = require('../src/table');

var database = mysql.createConnection({
  host     : 'cig-production.unl.edu',
  user     : 'historyharvest',
  password : 'history', 
  database : 'freedmen'
});

database.connect();

var DestinationModel, ContractModel, OfficeModel, WorkerModel;
var Contracts, Destinations, Offices, Workers;

(function createDestinations () {
  // create model for contractdestination
  DestinationModel = function () {
    Model.call(this);
    this.attrs = DestinationModel.attrs;
    this.relationships = DestinationModel.relationships;
    this.table = DestinationModel.table;
  };

  DestinationModel.prototype = Object.create( Model.prototype );
  DestinationModel.table = 'contractdestination';

  Destinations = new Table( database, DestinationModel );
})();

(function createOffices () {
  // create model for contracts
  OfficeModel = function () {
    Model.call(this);
    this.attrs = OfficeModel.attrs;
    this.relationships = OfficeModel.relationships;
    this.table = OfficeModel.table;
  };

  OfficeModel.prototype = Object.create( Model.prototype );
  OfficeModel.table = 'hiringoffice';

  Offices = new Table( database, OfficeModel );
})();

(function createWorkers () {
  // create model for contracts
  WorkerModel = function () {
    Model.call(this);
    this.attrs = WorkerModel.attrs;
    this.relationships = WorkerModel.relationships;
    this.table = WorkerModel.table;
  };

  WorkerModel.prototype = Object.create( Model.prototype );
  WorkerModel.table = 'worker';

  Workers = new Table( database, WorkerModel );
})();

(function createContracts () {
  // create model for contracts
  ContractModel = function () {
    Model.call(this);

    this.attrs = ContractModel.attrs;
    this.relationships = ContractModel.relationships;
    this.table = ContractModel.table;
  };

  ContractModel.prototype = Object.create( Model.prototype );
  ContractModel.table = 'contract';
  ContractModel.relationships = [
    {model: DestinationModel, key: 'destination_id'},
    {model: OfficeModel, key: 'office_id'},
    {model: WorkerModel, key: 'worker_id'}
  ];

  Contracts = new Table( database, ContractModel );
})();

module.exports = {
  database: database,
  end: function() { database.end(); return this; },

  Contracts: Contracts, 
  Workers: Workers
};