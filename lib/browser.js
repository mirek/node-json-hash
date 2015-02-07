"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.digest = digest;
var digest_ = require("./digest").digest;
var crypto_ = _interopRequire(require("./crypto"));

function digest(a) {
  var _ref = arguments[1] === undefined ? {} : arguments[1];
  var _ref$algorithm = _ref.algorithm;
  var algorithm = _ref$algorithm === undefined ? "sha1" : _ref$algorithm;
  var _ref$inputEncoding = _ref.inputEncoding;
  var inputEncoding = _ref$inputEncoding === undefined ? "utf8" : _ref$inputEncoding;
  var _ref$outputEncoding = _ref.outputEncoding;
  var outputEncoding = _ref$outputEncoding === undefined ? "hex" : _ref$outputEncoding;
  var _ref$crypto = _ref.crypto;
  var crypto = _ref$crypto === undefined ? crypto_ : _ref$crypto;
  return digest_(a, { algorithm: algorithm, inputEncoding: inputEncoding, outputEncoding: outputEncoding, crypto: crypto });
}
exports.__esModule = true;
//# sourceMappingURL=browser.js.map