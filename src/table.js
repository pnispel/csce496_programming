var Promise = require('promise-simple');
var colors = require('colors');

var Table = function ( database, model ) {
  this.database = database;
  this.model = model;
};

Table.prototype.buildQuery = function ( where ) {
  var self = this;
  var query = 'SELECT *';

  function addAttrsRecursive( model ) {
    var attrs = model.attrs.slice(0).map( function ( a ) {
      return ' ' + model.table + '.' + a;
    });

    query += attrs.join(',');

    if ( !model.relationships || 
       model.relationships.length < 0 ) { return; }

    model.relationships.forEach( function ( r ) {
      query += ',';
      addAttrsRecursive( r.model );
    });
  }

  function addRelationshipsRecursive( model ) {
    if ( !model.relationships || 
       model.relationships.length < 0 ) { return; }

    model.relationships.forEach( function ( r ) {
      query += ' INNER JOIN ' + r.model.table +
               ' ON ' + model.table + '.' + r.key + 
               ' = ' + r.model.table + ((r.to) ? ('.' + r.to) : '.id' );

      addRelationshipsRecursive( r.model );
    });
  }

  // addAttrsRecursive( this.model );

  query += ' FROM ' + this.model.table;

  addRelationshipsRecursive( this.model );
  
  if ( where ) {
    query += ' WHERE ' + where;
  }

  console.log( query.magenta );
  return query;
};

Table.prototype.find = function ( obj ) {
  var query = this.buildQuery( obj );

  var d = Promise.defer();
  var self = this;

  this.database.query({sql:query, nestTables: true}, function(err, rows, fields) {
    if (err) throw err;

    var ret = rows.map( function ( row ) {
      var model = new self.model();
      return model.parse( row );
    });

    d.resolve( ret );
  });

  return d;
};

module.exports = Table;