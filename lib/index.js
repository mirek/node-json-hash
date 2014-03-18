(function() {
  var crypto, digest;

  crypto = require('crypto');

  digest = function(a, options, stack) {
    var algo, element, encoding, hash, key, map, _i, _j, _len, _len1, _ref;
    if (options == null) {
      options = {};
    }
    if (stack == null) {
      stack = [];
    }
    algo = options.algo || 'sha1';
    encoding = options.encoding || 'hex';
    map = options.map || function(v, k, s) {
      return v;
    };
    hash = crypto.createHash(algo);
    switch (false) {
      case a !== null:
        hash.update('n');
        break;
      case a !== false:
      case a !== true:
      case !(a instanceof Boolean):
        hash.update(['f', a.valueOf()].join(':'));
        break;
      case !((typeof a === 'number') || a instanceof Number):
        hash.update(['i', a.toString()].join(':'));
        break;
      case !(typeof a === 'string' || a instanceof String):
        hash.update(['s', a.toString()].join(':'));
        break;
      case !(a instanceof Array):
        hash.update('[');
        for (_i = 0, _len = a.length; _i < _len; _i++) {
          element = a[_i];
          hash.update(['a', jsonHash(algo, element)].join(':'));
        }
        hash.update(']');
        break;
      case a.constructor !== Object:
        hash.update('{');
        _ref = Object.keys(a).sort();
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          key = _ref[_j];
          hash.update(['k', jsonHash(algo, key), 'v', jsonHash(algo, a[key])].join(':'));
        }
        hash.update('}');
        break;
      default:
        throw new Error('Unsupported type.');
    }
    return hash.digest(encoding);
  };

  if ((typeof module !== "undefined" && module !== null) && module.exports) {
    module.exports.digest = digest;
  }

}).call(this);
