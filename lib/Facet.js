var auto = require('autocomplete-element');

module.exports = Facet;

// `containerEl` = container element
//  `fieldMatcher`, `valueMatcher` -- callbacks for suggestions. They get
//    passed an instance of `autocomplete-element`
// `facetCb` -- callback that gets called when a facet (field and value pair)
//    exists
function Facet(containerEl, fieldMatcher, valueMatcher, facetCb) {
  if ( !(this instanceof Facet) ) {
    return new Facet(containerEl, fieldMatcher, valueMatcher, facetCb);
  }

  var self = this;

  this.el = containerEl;
  this.fieldEl = document.createElement('input');
  this.valueEl = document.createElement('input');
  this.el.appendChild(this.fieldEl);
  this.el.appendChild(this.valueEl);
  this.fieldInput = auto(this.fieldEl, fieldMatcher);
  this.valueInput = auto(this.valueEl, valueMatcher);

  this.valueEl.addEventListener('keyup', function(ev) {
    if (ev.keyCode === 13 || ev.keyCode === 9) {
      console.log(ev.keyCode, 'in here');
      // also make sure one of the matches is highlighted
      facetCb.call(self, self);
    }
  });
}

Facet.prototype.getFacet = function() {
  return {
    field: this.fieldEl.value,
    value: this.valueEl.value,
  };
};
