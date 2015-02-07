var arrize, assert, crypto, cryptos, our, ours, rnd, rnds;

assert = require('assert');

crypto = require('crypto');

our = require('../lib/crypto');

arrize = function(a) {
  if (Array.isArray(a)) {
    return a;
  } else {
    return [a];
  }
};

cryptos = function(as, e) {
  var b, h, _i, _len, _ref;
  h = crypto.createHash('sha1');
  _ref = arrize(as);
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    b = _ref[_i];
    h.update(b, e);
  }
  return h.digest('hex');
};

ours = function(as, e) {
  var b, h, _i, _len, _ref;
  h = our.createHash('sha1');
  _ref = arrize(as);
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    b = _ref[_i];
    h.update(b, e);
  }
  return h.digest('hex');
};

rnd = function(n) {
  var codes, latin, polish, special, _i, _results;
  latin = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  polish = 'ąćęłńóśżź';
  special = '\0\t\n\r';
  codes = (latin + polish + special).split('');
  return (function() {
    _results = [];
    for (var _i = 0; 0 <= n ? _i < n : _i > n; 0 <= n ? _i++ : _i--){ _results.push(_i); }
    return _results;
  }).apply(this).map(function() {
    return codes[Math.random() * codes.length | 0];
  }).join('');
};

rnds = function(n, m) {
  var _i, _results;
  return (function() {
    _results = [];
    for (var _i = 0; 0 <= m ? _i < m : _i > m; 0 <= m ? _i++ : _i--){ _results.push(_i); }
    return _results;
  }).apply(this).map(function() {
    return rnd((Math.random() * n) | 0);
  });
};

describe('sha1', function() {
  it('should generate same hash for different sizes', function() {
    var e, i, r, _i, _results;
    _results = [];
    for (i = _i = 0; _i < 1025; i = ++_i) {
      r = rnd(i);
      _results.push((function() {
        var _j, _len, _ref, _results1;
        _ref = [void 0, 'binary', 'ascii', 'utf8'];
        _results1 = [];
        for (_j = 0, _len = _ref.length; _j < _len; _j++) {
          e = _ref[_j];
          _results1.push(assert.equal(ours(r, e), cryptos(r, e)));
        }
        return _results1;
      })());
    }
    return _results;
  });
  it('should generate same hash for multiple updates', function() {
    var e, i, r, _i, _results;
    _results = [];
    for (i = _i = 0; _i < 100; i = ++_i) {
      r = rnds(71, i);
      _results.push((function() {
        var _j, _len, _ref, _results1;
        _ref = [void 0, 'binary', 'ascii', 'utf8'];
        _results1 = [];
        for (_j = 0, _len = _ref.length; _j < _len; _j++) {
          e = _ref[_j];
          _results1.push(assert.equal(ours(r, e), cryptos(r, e)));
        }
        return _results1;
      })());
    }
    return _results;
  });
  return it('should handle utf8', function() {
    var e, r, _i, _len, _ref, _results;
    r = 'Dopóki nie skorzys­tałem z In­terne­tu, nie wie­działem, że na świecie jest ty­lu idiotów.';
    _ref = [void 0, 'binary', 'ascii', 'utf8'];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      e = _ref[_i];
      _results.push(assert.equal(ours(r, e), cryptos(r, e)));
    }
    return _results;
  });
});
