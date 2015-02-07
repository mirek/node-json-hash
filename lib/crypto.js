"use strict";

// var INPUT_ENCODINGS = [ 'binary', 'ascii', 'utf8' ]
// var OUTPUT_ENCODINGS = [ 'binary', 'hex', 'base64' ]

function N(r, a, enc) {
  if (Array.isArray(a)) {
    var _n = a.length;
    for (var i = 0; i < _n; i++) {
      r.push(a[i]);
    }
  } else {
    if (enc === "utf8") {
      var b = unescape(encodeURIComponent(a));
      var _n2 = b.length;
      for (var i = 0; i < _n2; i++) {
        r.push(b.charCodeAt(i));
      }
    } else {
      var _n3 = a.length;
      for (var i = 0; i < _n3; i++) {
        var _c = a.charCodeAt(i) & 255;
        r.push(_c === 0 && enc === "ascii" ? 32 : _c);
      }
    }
  }
}

var O = function (a, c) {
  var r = null;
  var s = function (e) {
    return String.fromCharCode(e);
  };
  var h = function (e) {
    return e.toString(16);
  };
  switch (c) {
    case "binary":
      r = a.map(s).join("");break;
    case "base64":
      r = atob(a.map(s).join(""));break;
    default:
      r = a.map(h).join("");break;
  }
  return r;
};

var R = function (n, s) {
  return n << s | n >>> 32 - s;
};

function SHA1(w) {
  var n = w.length;
  var M = 4294967295;
  var W = new Array(80);
  var H = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];

  for (var b = 0; b < w.length; b += 16) {
    var A = H[0],
        B = H[1],
        C = H[2],
        D = H[3],
        E = H[4];

    for (var i = 0; i < 16; i++) {
      W[i] = w[b + i];
    }

    for (var i = 16; i <= 79; i++) {
      W[i] = R(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
    }

    for (var i = 0; i <= 19; i++) {
      var t = R(A, 5) + (B & C | ~B & D) + E + W[i] + 1518500249 & M;
      E = D;D = C;C = R(B, 30);B = A;A = t;
    }

    for (var i = 20; i <= 39; i++) {
      var t = R(A, 5) + (B ^ C ^ D) + E + W[i] + 1859775393 & M;
      E = D;D = C;C = R(B, 30);B = A;A = t;
    }

    for (var i = 40; i <= 59; i++) {
      var t = R(A, 5) + (B & C | B & D | C & D) + E + W[i] + 2400959708 & M;
      E = D;D = C;C = R(B, 30);B = A;A = t;
    }

    for (var i = 60; i <= 79; i++) {
      var t = R(A, 5) + (B ^ C ^ D) + E + W[i] + 3395469782 & M;
      E = D;D = C;C = R(B, 30);B = A;A = t;
    }

    H[0] = H[0] + A & M;
    H[1] = H[1] + B & M;
    H[2] = H[2] + C & M;
    H[3] = H[3] + D & M;
    H[4] = H[4] + E & M;
  }

  return H;
}

function createHash(algorithm) {
  var r = null;
  switch (algorithm) {

    // We support SHA1 only for now.
    case "sha1":
      r = createHashSHA1(algorithm);
      break;

    default:
      throw new Error("Digest method not supported.");
  }
  return r;
}

function createHashSHA1() {
  var m = 0;
  var c = [];
  var r = [];
  return {
    update: function (a, e) {
      N(c, a, e);
    },
    digest: function (outputEncoding) {
      var n = c.length;
      for (var i = 0; i < n - 3; i += 4) {
        r.push(c[i] << 24 | c[i + 1] << 16 | c[i + 2] << 8 | c[i + 3]);
      }

      switch (n % 4) {
        case 0:
          r.push(2147483648);break;
        case 1:
          r.push(c[n - 1] << 24 | 8388608);break;
        case 2:
          r.push(c[n - 2] << 24 | c[n - 1] << 16 | 32768);break;
        case 3:
          r.push(c[n - 3] << 24 | c[n - 2] << 16 | c[n - 1] << 8 | 128);break;
      }
      while (r.length % 16 != 14) {
        r.push(0);
      }
      r.push(n >>> 29);
      r.push(n << 3 & 4294967295);

      // r.map(
      //   function (a) {
      //     var r = []
      //     for (var i = 7; i >= 0; --i) {
      //       r.push(((a >>> (i * 4)) & 0x0f).toString(16))
      //     }
      //     return r.join('')
      //   }
      // ).join('')

      return O(SHA1(r).reduce(function (r, a) {
        for (var i = 7; i >= 0; --i) {
          r.push(a >>> i * 4 & 15);
        }
        return r;
      }, []), outputEncoding);
    }
  };
}

// if (!module.parent) {
//   var h = createHashSHA1()
//   h.update('hello')
//   console.log(h.digest('hex'))
// }

module.exports = {
  createHash: createHash
};
//# sourceMappingURL=crypto.js.map