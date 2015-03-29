var Search = require('../'),
    auto = require('autocomplete-element'),
    leveljs = require('level-js'),
    levelup = require('levelup');

window.db = levelup('months', {db: leveljs});
var input = document.querySelector('input');

auto(input, staticMatcher);

input.addEventListener('keyup', function(ev) {
  if (ev.keyCode === 13 || ev.keyCode === 9) {
    console.log(ev.keyCode);
  }
});

var months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
];


function staticMatcher(c) {
  if (!input.value.length) return c.suggest([]);
    var matches = months.filter(function (m) {
        return lc(m.slice(0, input.value.length)) === lc(input.value);
    });
    c.suggest(matches);
}
function lc (x) { return x.toLowerCase(); }

// this depends on keys being lower case month names
function matcher(autoComp) {
  if (!input.value.length) return autoComp.suggest([]);

  var fragment = input.value.toLowerCase();
  var matches = [];
  window.db.createReadStream({
    gte: fragment,
    lt: fragment+'\xff'
  }).on('data', function(data) {
    matches.push(data.value);
  }).on('end', function() {
    autoComp.suggest(matches);
  });
}


var fields = [
  'month',
  'year',
  'day',
];

var fieldMatcher = createMatcher(fields);
var valueMatcher = createMatcher(months);

// create a cb for auto complete elmt. `data` is array of strings.
function createMatcher(data) {
  return function(c, ev) {
    if (!ev.target.value.length) return c.suggest([]);
    var matches = data.filter(function (item) {
      return lc(item.slice(0, ev.target.value.length)) === lc(ev.target.value);
    });
    c.suggest(matches);
  };
}


// search box part

var search = new Search(document.querySelector('.search'), {
  fieldMatcher: fieldMatcher,
  valueMatcher: valueMatcher,
  opMatcher: function() {},
});
