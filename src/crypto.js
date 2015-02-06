
function N(r, a, enc) {
  if (Array.isArray(a)) {
    var n = a.length
    for (var i = 0; i < n; i++) {
      r.push(a[i])
    }
  } else {
    if (enc === 'utf8') {
      var b = unescape(encodeURIComponent(a))
      var n = b.length
      for (var i = 0; i < n; i++) {
        r.push(b.charCodeAt(i))
      }
    } else {
      var n = a.length
      for (var i = 0; i < n; i++) {
        var c = a.charCodeAt(i) & 0xff
        r.push((c === 0 && enc === 'ascii') ? 0x20 : c)
      }
    }
  }
}

var R = function (n, s) {
  return (n << s) | (n >>> (32 - s))
}

function SHA1(w) {

  var n = w.length
  var M = 0x0ffffffff
  var W = new Array(80)
  var H = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]

  for (var b = 0; b < w.length; b += 16) {
    var A = H[0]; var B = H[1]; var C = H[2]; var D = H[3]; var E = H[4]

    for (var i = 0; i < 16; i++) {
      W[i] = w[b + i]
    }

    for (var i = 16; i <= 79; i++) {
      W[i] = R(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1)
    }

    for (var i = 0; i <= 19; i++) {
      var t = (R(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & M
      E = D; D = C; C = R(B, 30); B = A; A = t
    }

    for (var i = 20; i <= 39; i++) {
      var t = (R(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & M
      E = D; D = C; C = R(B, 30); B = A; A = t
    }

    for (var i = 40; i <= 59; i++) {
      var t = (R(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & M
      E = D; D = C; C = R(B, 30); B = A; A = t
    }

    for (var i = 60; i <= 79; i++) {
      var t = (R(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & M
      E = D; D = C; C = R(B, 30); B = A; A = t
    }

    H[0] = (H[0] + A) & M
    H[1] = (H[1] + B) & M
    H[2] = (H[2] + C) & M
    H[3] = (H[3] + D) & M
    H[4] = (H[4] + E) & M
  }

  return H
}

function createHash(algo) {
  if (algo !== 'sha1') throw new Error('Expected sha1 algorithm.')
  var m = 0
  var c = []
  var r = []
  return {
    update: function (a, enc) {
      N(c, a, enc)
    },
    digest: function (enc) { // TODO: enc

      var n = c.length
      for (var i = 0; i < n - 3; i += 4) {
        r.push(
          c[i] << 24 | c[i + 1] << 16 | c[i + 2] << 8 | c[i + 3]
        )
      }

      switch (n % 4) {
        case 0: r.push(0x080000000); break
        case 1: r.push(c[n - 1] << 24 | 0x0800000); break
        case 2: r.push(c[n - 2] << 24 | c[n - 1] << 16 | 0x08000); break
        case 3: r.push(c[n - 3] << 24 | c[n - 2] << 16 | c[n - 1] << 8 | 0x80); break
      }
      while ((r.length % 16) != 14) {
        r.push(0)
      }
      r.push(n >>> 29)
      r.push((n << 3) & 0x0ffffffff)

      return SHA1(r).map(
        function (a) {
          var r = []
          for (var i = 7; i >= 0; --i) {
            r.push(((a >>> (i * 4)) & 0x0f).toString(16))
          }
          return r.join('')
        }
      ).join('')
    }
  }
}

module.exports = {
  createHash: createHash
}
