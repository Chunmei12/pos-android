import conf from './conf'
var base64url = require('base64url');
var jsSHA = require("jssha");
var KJUR = require('jsrsasign');

export function sign(data) {

// get HASH
  var shaObj = new jsSHA("SHA-256", "TEXT");
  shaObj.update(data);
  var hash = shaObj.getHash("HEX");
// RSA signing
  var sig = new KJUR.crypto.Signature({"alg": "SHA256withRSA"});
  var rsakey = new KJUR.RSAKey();
  rsakey.readPrivateKeyFromPEMString(conf.privateKey);
  sig.init(rsakey);
  sig.updateString(hash);
  const signature = sig.sign()
  return base64url.encode(signature);
}

export function verify(data, signatureBase64) {

    const signature = base64url.decode(signatureBase64);
  // get HASH
    var shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update(data);
    var hash = shaObj.getHash("HEX");
    
  // Verify signatrure
    var sig = new KJUR.crypto.Signature({"alg": "SHA256withRSA"});
    sig.initVerifyByCertificatePEM(conf.publicKey);
    sig.updateString(hash)
    return sig.verify(signature);
}

module.exports = { sign, verify };