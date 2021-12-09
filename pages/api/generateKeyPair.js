export default function handler(req, res) {
  
  // Libreria para generar las llaves
  const crypto = require('crypto')

  // Genera las llaves publica y privada
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,  // Tamaño de las llaves
    publicKeyEncoding: {
      type: 'pkcs1',      // Tipo de llave publica
      format:'pem'        // Formato en que se genera la llave privada
    },
    privateKeyEncoding: {
      type: 'pkcs8',      // Tipo de llave privada
      format:'pem'        // Formato en que se genera la llave privada
    }
  })

  // Valida que el metodo sea GET
  switch(req.method) {
    case 'GET':
      res.status(200).json(keyPair)
      break;
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
