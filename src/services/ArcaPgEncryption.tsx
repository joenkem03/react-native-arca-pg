import forge from 'node-forge'; // npm i node-forge
import JSEncrypt from 'jsencrypt'; // npm i jsencrypt

// // react-native-xml2js.d.ts
// declare module 'react-native-xml2js';
// @ts-ignore
import xml2js from 'react-native-xml2js';

export function EncryptCreateOrder(params: any) {
  const payload = {
    customer: {
      first_name: params.first_name,
      last_name: params.last_name,
      mobile: params.mobile,
      country: params.country,
      email: params.email,
    },
    order: {
      amount: params.amount,
      reference: params.reference,
      description: params.description,
      currency: params.currency,
    },
    // ,
    // "payment": {
    //   "redirect_url": "https://portal.finvert.io/arca/redirect/SDPKRS1714115686"
    // }
  };
  // if (params.redirect_url !== null && params.redirect_url !== undefined) {
  //   payload.payment.redirect_url = params.redirect_url
  // }
  const raw = JSON.stringify(payload);
  console.log('order ', raw);
  return PayloadEncrypt(raw, params.merchant_encryption_key);
}

export function EncryptPayOrder(params: any) {
  console.log('see oo ', params);
  const payload = {
    reference: params.reference,
    payment_option: 'C',
    country: params.country,
    card: {
      cvv: params.cvv,
      card_number: params.card,
      expiry_month: params.expiry_month,
      expiry_year: params.expiry_year,
    },
  };
  const raw = JSON.stringify(payload);
  console.log('pay ', raw);
  return PayloadEncrypt(raw, params.merchant_encryption_key);
}

export function PayloadEncrypt(message: string, merchantEncryptionKey: string) {
  // const merchantEncryptionKey = '__YOUR_ENCRYPTION_KEY__';
  const encPemKey = getRsaEncryptionKey(merchantEncryptionKey);

  // console.log('------ returned pem --------')
  // console.log(encPemKey);

  const encrypt = new JSEncrypt();

  encrypt.setPublicKey(encPemKey);

  const encryptedMessage = encrypt.encrypt(message);

  if (encryptedMessage) {
    console.log('Encrypted Message:', encryptedMessage);
  } else {
    console.error('Encryption failed.');
  }
  return encryptedMessage;
}

function getRsaEncryptionKey(merchantEncryptionKey: string) {
  // Decode the Base64 string
  const decodedKey = atob(merchantEncryptionKey).split('!');
  // console.log(decodedKey);
  const rsaXml = decodedKey[1];
  // console.log(rsaXml);
  return xmlToPem(rsaXml);
}

function xmlToPem(xmlKey: any) {
  var pem = '';
  const parser = new xml2js.Parser();
  parser.parseString(xmlKey, function (err: any, result: any) {
    // console.dir(result)
    console.log(err);

    // Extract Modulus and Exponent
    const modulusBase64 = result.RSAKeyValue.Modulus[0];
    const exponentBase64 = result.RSAKeyValue.Exponent[0];
    // console.log('modulusBase64:', modulusBase64);
    // console.log('exponentBase64:', exponentBase64);

    var BigInteger = forge.jsbn.BigInteger;
    function parseBigInteger(b64: any) {
      return new BigInteger(
        forge.util.createBuffer(forge.util.decode64(b64)).toHex(),
        16
      );
    }

    var publicKey = forge.pki.setRsaPublicKey(
      parseBigInteger(modulusBase64), // n
      parseBigInteger(exponentBase64)
    ); // e

    // convert a Forge public key to PEM-format
    var rpem = forge.pki.publicKeyToPem(publicKey);
    pem = rpem;
  });
  return pem;
}
