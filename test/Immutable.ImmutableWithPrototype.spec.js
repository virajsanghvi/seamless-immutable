var JSC          = require("jscheck");
var _            = require("lodash");
var assert       = require("chai").assert;
var devBuild     = require("../seamless-immutable.development.js");
var prodBuild    = require("../seamless-immutable.production.min.js");
var getTestUtils = require("./TestUtils.js");

[
  {id: "dev",  name: "Development build", implementation: devBuild},
  {id: "prod", name: "Production build",  implementation: prodBuild}
].forEach(function(config) {
  var Immutable = config.implementation;
  var TestUtils = getTestUtils(Immutable);

  describe(config.name, function () {
    describe("Immutable.ImmutableWithPrototype", function() {

      it('should preserve prototype on creation', function() {
        function Foo(o) { _.extend(this, o); };
        Foo.prototype.foobar = function() {};

        var fooInstance = new Foo({a: 1, b: 2});

        // preserves prototype
        var fooImmutable = Immutable.ImmutableWithPrototype(fooInstance);
        assert.strictEqual(fooImmutable.prototype, fooInstance.prototype);
        assert.deepEqual(fooImmutable, fooInstance);
        assert.isFunction(fooImmutable.foobar);

        // preserves during merge
        var fooImmutableAfterMerge = fooImmutable.merge({c: 3});
        assert.strictEqual(fooImmutableAfterMerge.prototype, fooInstance.prototype);
        assert.deepEqual(_.clone(fooImmutableAfterMerge), _.extend({}, fooInstance, {c:3}));

        // preserves during without
        var fooImmutableAfterWithout = fooImmutable.without('b');
        assert.strictEqual(fooImmutableAfterWithout.prototype, fooInstance.prototype);
        assert.deepEqual(_.clone(fooImmutableAfterWithout), {a:1});

        // preserves during asMutable
        var fooImmutableAfterAsMutable = fooImmutable.asMutable();
        assert.strictEqual(fooImmutableAfterAsMutable.prototype, fooInstance.prototype);
        assert.deepEqual(_.clone(fooImmutableAfterAsMutable), _.clone(fooInstance));

        // preserved during nesting
        var immutableArray = Immutable([fooImmutable]);
        assert.strictEqual(immutableArray[0].prototype, fooInstance.prototype);
      });
      
    });
  });
});
