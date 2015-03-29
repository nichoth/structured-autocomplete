var auto = require('autocomplete-element'),
    Facet = require('./lib/Facet');

var StructuredSearch = function(containerEl, opts) {
  if ( !(this instanceof StructuredSearch) ) {
    return new StructuredSearch(containerEl, opts);
  }

  var self = this;

  this.fieldMatcher = opts.fieldMatcher;
  this.valueMatcher = opts.valueMatcher;
  this.opMatcher = opts.opMatcher;

  this.el = containerEl;
  // this.expr = '';  // root of expression tree
  this.expr = [];
  this.nextFacet = '';  // nextFacet = empty inputs

  addEmptyFacet(this);
};

StructuredSearch.prototype.onFacetMatch = function(facet) {
  this.expr.push(facet);
  addEmptyFacet(this);
};

function addEmptyFacet(searchBox) {
  var facetEl = document.createElement('div');
  searchBox.el.appendChild(facetEl);
  searchBox.nextFacet = Facet(facetEl,
    searchBox.fieldMatcher,
    searchBox.valueMatcher,
    searchBox.onFacetMatch.bind(searchBox));
}

function OpInput(containerEl, matcher, onMatch) {
  var self = this;
  this.el = containerEl;
  this.inputEl = document.createElement('input');
  this.input = auto(inputEl, matcher);

  this.inputEl.addEventListener('keyup', function(ev) {
    if (ev.keyCode === 13 || ev.keyCode === 9) {
      console.log(ev.keyCode, 'in here');
      // also make sure one of the matches is highlighted
      onMatch(self);
    }
  });
}

module.exports = StructuredSearch;
