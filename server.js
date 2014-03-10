var colors = require('colors');
var _ = require('lodash');

var db = {
  freedmen: require('./databases/freedmen_database'),
  political: require('./databases/political_database'),
  population: require('./databases/population_database')
};

var data = [];
var populationData = [];
var votingData = [];

function getPopulationForYear ( year ) {
  var ret = populationData[0];
  var diff = Math.abs( year - 1840 );
  var sum = 0;

  populationData.forEach( function ( date ) {
    if ( Math.abs( year - date[0].year ) < diff ) {
      diff = Math.abs( year - date[0].year );
      ret = date;
    }
  });

  ret.map( function ( data ) {
    sum += data.total_population;
  });

  return {sum: sum, obj: ret};
}

function getBestStates ( population, votes ) {
  var states = _.uniq( votes.map(function (vote){ return vote.fusion_link_states.state; }) );
  
  states = states.map( function ( state ) {
    var populationInState = _.filter( population.slice(0), function ( p ) { return p.nhgis_boundaries.state_name === state; } );
    var votesInState = _.filter( votes.slice(0), function ( vote ) { return vote.fusion_link_states.state === state; } );

    var totalVotesInState = 0;
    votesInState.forEach(function (vote) { totalVotesInState += vote.votes; });

    var totalPopulationInState = 0;
    populationInState.forEach(function (p) { totalPopulationInState += p.total_population; });

    var percent = totalVotesInState/totalPopulationInState * 100;

    // fix bad data
    if ( percent > 100 ) { percent = 0; }

    return {state: state, percent: percent};
  });

  states.sort(function (a, b) {
    if ( a > 100 ) { return -1; }
    if ( b > 100 ) { return 1; }

    return b.percent.toFixed(2) - a.percent.toFixed(2);
  });

  return states.slice(0, 5);
}

function printVotingData ( year, population, votes, states ) {
  var percent = {
    pres: votes.pres/population * 100,
    gov: votes.gov/population * 100,
    cong: votes.cong/population * 100
  };

  console.log('\n');

  console.log(year.green);
  console.log('population: ' + population);
  
  console.log('==========   P R E S I D E N T   ========='.magenta);
  console.log('votes: ' + votes.pres);
  console.log('%: ' + percent.pres.toFixed(2) + '%');

  console.log('==========   C O N G R E S S   ========='.magenta);
  console.log('votes: ' + votes.cong);
  console.log('%: ' + percent.cong.toFixed(2) + '%');

  console.log('==========   G O V E R N O R   ========='.magenta);
  console.log('votes: ' + votes.gov);
  console.log('%: ' + percent.gov.toFixed(2) + '%');

  console.log('==========   T O P   S T A T E S   ========='.magenta);
  _.each( states, function ( state, index ) {
    console.log( (index + 1) + ') ' + state.state + ' : ' + state.percent.toFixed(2) + '%' );
  });
}

function prettyPrint() {
  if ( populationData.length !== 4 || votingData.length === 0 ) { return; }

  votingData.forEach( function ( data ) {
    var population = getPopulationForYear( data.year );
    var bestStates = getBestStates(population.obj, data._voting_data);
    
    printVotingData(data.year.toString(), population.sum, data.votes, bestStates);
  });
}

db.population.PopulationData.find().then(function ( population ) {
  populationData.push( _.filter( population.slice(0), {year: 1840} ) );
  populationData.push( _.filter( population.slice(0), {year: 1850} ) );
  populationData.push( _.filter( population.slice(0), {year: 1860} ) );
  populationData.push( _.filter( population.slice(0), {year: 1870} ) );
  prettyPrint();
});

db.political.Votes
.find('(election.year=1840' +
      ' OR election.year=1844' +
      ' OR election.year=1848' +
      ' OR election.year=1852' +
      ' OR election.year=1856' +
      ' OR election.year=1860' +
      ' OR election.year=1864)' +
      ' AND election.description != \"HAL\"')
.then(function ( votes ) {
  [1840, 1844, 1848, 1852, 1856, 1860, 1864].forEach(function (year) {
    var year_votes = _.filter( votes.slice(0), function (vote) { 
      return vote.election.year === year;
    });

    var totalvotes = {
      pres: 0,
      gov: 0,
      cong: 0
    };

    var data = {};

    _.filter( year_votes.slice(0), function (vote) { 
      return vote.election.description === 'PRES';
    }).map(function( c ) { totalvotes.pres += c.votes });

    _.filter( year_votes.slice(0), function (vote) { 
      return vote.election.description === 'GOV';
    }).map(function( c ) { totalvotes.gov += c.votes });

    _.filter( year_votes.slice(0), function (vote) { 
      return vote.election.description === 'CONG';
    }).map(function( c ) { totalvotes.cong += c.votes });

    votingData.push( {year: year, votes: totalvotes, _voting_data: year_votes} );
  });

  prettyPrint();
});

for ( var i in db ) { db[i].end(); }