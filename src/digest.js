
// Compute digest for JSON object.
export function digest (a, { algorithm = 'sha1', inputEncoding = 'utf8', outputEncoding = 'hex', crypto, sets } = {}) {
  let h = crypto.createHash(algorithm)
  let u = (...args) => h.update(args.join(':'), inputEncoding)
  let d = a => digest(a, { algorithm, inputEncoding, outputEncoding, crypto, sets })
  switch (true) {

    // undefined
    case typeof(a) === 'undefined':
      u('u')
      break;

    // null
    case a === null:
      u('n')
      break

    // boolean
    case typeof a === 'boolean':
    case a instanceof Boolean:
      u('f', a.valueOf())
      break

    // number
    case typeof a === 'number':
    case a instanceof Number:
      u('i', `${a}`)
      break

    // string
    case typeof a === 'string':
    case a instanceof String:
      u('s', `${a}`)
      break

    // symbol
    case typeof a === 'symbol':
    case a instanceof Symbol:
      u('S', `${a}`)
      break

    // date
    case a instanceof Date:
      u('d', a.toISOString())
      break

    // regexp
    case a instanceof RegExp:
      u('x', `${a}`)
      break

    // function
    case a instanceof Function:
      u('F', a.toString())
      break

    // array
    case Array.isArray(a):
      if (sets) {
        u('<')
        a.map(d).sort().forEach(e => u('A', e))
        u('>')
      } else {
        u('[')
        a.forEach(e => u('a', d(e)))
        u(']')
      }
      break

    // object
    default:
      u('{')
      Object.keys(a).sort().forEach((k) => u('k', d(k), 'v', d(a[k])))
      u('}')
      break
  }
  return h.digest(outputEncoding)
}
