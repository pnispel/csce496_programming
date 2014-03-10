var Promise = require('promise-simple');

var Model = function () {
};

Model.prototype.parse = function ( row ) {
  var addAttrs = function (obj, on) {
    for ( var j in obj ) {
      on[j.toLowerCase()] = obj[j];
    }
  }

  for ( var i in row ) {
    if ( i === this.table ) {
      addAttrs( row[i], this );
    } else {
      this[i] = {};
      addAttrs( row[i], this[i] );
    }
  }

  return this;
};

module.exports = Model;