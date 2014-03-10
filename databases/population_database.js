var mysql = require('mysql');
var Model = require('../src/model');
var Table = require('../src/table');

var database = mysql.createConnection({
  host     : 'cig-production.unl.edu',
  user     : 'historyharvest',
  password : 'history', 
  database : 'population'
});

database.connect();

var BoundaryModel, PopulationDataModel;

var Boundaries, PopulationData;

(function createBoundaries () {
  // create model for contracts
  BoundaryModel = function () {
    Model.call(this);

    this.attrs = BoundaryModel.attrs;
    this.relationships = BoundaryModel.relationships;
    this.table = BoundaryModel.table;
  };

  BoundaryModel.prototype = Object.create( Model.prototype );
  BoundaryModel.table = 'nhgis_boundaries';

  Boundaries = new Table( database, BoundaryModel );
})();

(function createPopulationData () {
  // create model for contracts
  PopulationDataModel = function () {
    Model.call(this);

    this.attrs = PopulationDataModel.attrs;
    this.relationships = PopulationDataModel.relationships;
    this.table = PopulationDataModel.table;
  };

  PopulationDataModel.prototype = Object.create( Model.prototype );
  PopulationDataModel.table = 'population_data';
  PopulationDataModel.relationships = [
    {
      model: BoundaryModel, 
      key: 'nhgis_boundary'
    }
  ];
  
  PopulationData = new Table( database, PopulationDataModel );
})();

module.exports = {
  database: database,
  end: function() { database.end(); return this; },

  Boundaries: Boundaries,
  PopulationData: PopulationData
};