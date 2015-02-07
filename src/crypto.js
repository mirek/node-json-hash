
// var INPUT_ENCODINGS = [ 'binary', 'ascii', 'utf8' ]
// var OUTPUT_ENCODINGS = [ 'binary', 'hex', 'base64' ]

function N(r, a, enc) {
  if (Array.isArray(a)) {
    let n = a.length
    for (let i = 0; i < n; i++) {
      r.push(a[i])
    }
  } else {
    if (enc === 'utf8') {
      let b = unescape(encodeURIComponent(a))
      let n = b.length
      for (let i = 0; i < n; i++) {
        r.push(b.charCodeAt(i))
      }
    } else {
      let n = a.length
      for (let i = 0; i < n; i++) {
        let c = a.charCodeAt(i) & 0xff
        r.push((c === 0 && enc === 'ascii') ? 0x20 : c)
      }
    }
  }
}

var O = function(a, c) {
  let r = null
  let s = function (e) { return String.fromCharCode(e) }
  let h = function (e) { return e.toString(16) }
  switch (c) {
    case 'binary': r = a.map(s).join(''); break
    case 'base64': r = atob(a.map(s).join('')); break
    default: r = a.map(h).join(''); break
  }
  return r
}

var R = function (n, s) {
  return (n << s) | (n >>> (32 - s))
}

function SHA1(w) {

  let n = w.length
  let M = 0x0ffffffff
  let W = new Array(80)
  let H = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]

  for (var b = 0; b < w.length; b += 16) {
    let A = H[0], B = H[1], C = H[2], D = H[3], E = H[4]

    for (let i = 0; i < 16; i++) {
      W[i] = w[b + i]
    }

    for (let i = 16; i <= 79; i++) {
      W[i] = R(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1)
    }

    for (let i = 0; i <= 19; i++) {
      let t = (R(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & M
      E = D; D = C; C = R(B, 30); B = A; A = t
    }

    for (let i = 20; i <= 39; i++) {
      let t = (R(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & M
      E = D; D = C; C = R(B, 30); B = A; A = t
    }

    for (let i = 40; i <= 59; i++) {
      let t = (R(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & M
      E = D; D = C; C = R(B, 30); B = A; A = t
    }

    for (let i = 60; i <= 79; i++) {
      let t = (R(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & M
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

function createHash(algorithm) {
  let r = null
  switch (algorithm) {

    // We support SHA1 only for now.
    case 'sha1':
      r = createHashSHA1(algorithm)
      break

    default:
      throw new Error('Digest method not supported.')
  }
  return r
}

function createHashSHA1() {
  let m = 0
  let c = []
  let r = []
  return {
    update: function (a, e) {
      N(c, a, e)
    },
    digest: function (outputEncoding) {

      let n = c.length
      for (let i = 0; i < n - 3; i += 4) {
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

      // r.map(
      //   function (a) {
      //     var r = []
      //     for (var i = 7; i >= 0; --i) {
      //       r.push(((a >>> (i * 4)) & 0x0f).toString(16))
      //     }
      //     return r.join('')
      //   }
      // ).join('')

      return O(
        SHA1(r).reduce(
          function (r, a) {
            for (let i = 7; i >= 0; --i) {
              r.push(a >>> (i * 4) & 0x0f)
            }
            return r
          }
        , [])
      , outputEncoding)
    }
  }
}

// if (!module.parent) {
//   var h = createHashSHA1()
//   h.update('hello')
//   console.log(h.digest('hex'))
// }

module.exports = {
  createHash: createHash
}
