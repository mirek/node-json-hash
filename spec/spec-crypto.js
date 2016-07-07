
import assert from 'assert'
import crypto from 'crypto'
import our from '../src/crypto'

function arrize (a) {
  return Array.isArray(a) ? a : [ a ]
}

function cryptos (as, e) {
  let h = crypto.createHash('sha1')
  arrize(as).forEach((a) => {
    h.update(a, e)
  })
  return h.digest('hex')
}

function ours (as, e) {
  let h = our.createHash('sha1')
  arrize(as).forEach((a) => {
    h.update(a, e)
  })
  return h.digest('hex')
}

function rnd (n) {
  let latin = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let polish = 'ąćęłńóśżź'
  let special = '\0\t\n\r'
  let codes = (latin + polish + special).split('')
  let r = []
  for (let i = 0; i < n; i++) {
    r.push( codes[(Math.random() * codes.length) | 0] )
  }
  return r.join('')
}

function rnds (n, m) {
  let r = []
  for (let i = 0; i < m; i++) {
    r.push(rnd((Math.random() * n) | 0))
  }
  return r
}

describe('sha1', function() {

  it('should generate same hash for different sizes', function () {
    for (let i = 0; i <= 1025; i++) {
      let r = rnd(i)
      for (let e in [ undefined, 'binary', 'ascii', 'utf8' ]) {
        assert.equal(ours(r, e), cryptos(r, e))
      }
    }
  })

  it('should generate same hash for multiple updates', function () {
    for (let i = 0; i < 100; i++) {
      let r = rnds(71, i)
      for (let e in [ undefined, 'binary', 'ascii', 'utf8' ]) {
        assert.equal(ours(r, e), cryptos(r, e))
      }
    }
  })

  it('should handle utf8', function () {
    let r = 'Dopóki nie skorzys­tałem z In­terne­tu, nie wie­działem, że na świecie jest ty­lu idiotów.'
    for (let e in [ undefined, 'binary', 'ascii', 'utf8' ]) {
      assert.equal(ours(r, e), cryptos(r, e))
    }
  })

})
