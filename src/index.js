
import { digest as digest_ } from "./digest"
import crypto_ from "crypto"

export function digest (a, { algorithm = 'sha1', inputEncoding = 'utf8', outputEncoding = 'hex', crypto = crypto_, sets } = {}) {
  return digest_(a, { algorithm, inputEncoding, outputEncoding, crypto, sets })
}
