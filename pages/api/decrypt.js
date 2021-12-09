export default function handler(req, res) {
	const { encryptedData, privateKey  } = req.body;

	// Valida si existe un texto encriptado y una llave publica
	if(encryptedData && privateKey) {

		// Libreria para el decifrado rsa
		const crypto = require('crypto')
 
		// Encripta el texto plano
		const decryptedData = crypto.privateDecrypt(
			{
				key: privateKey,
				padding: crypto.constants.RSA_PKCS1_PADDING,
			},
			// Convierte el texto encriptado en formato base 64 a un buffer de bits
			// y luego lo convierte a texto plano
			Buffer.from(encryptedData, 'base64')
		).toString()

		// Valida que el metodo sea post
		switch(req.method) {
			case 'POST':
				res.status(200).json({ decryptedData })
				break;
			default:
				res.setHeader('Allow', ['POST'])
				res.status(405).end(`Method ${req.method} Not Allowed`)
		}
	} else {
		res.status(400).end(`Bad Request`)
	}
 
}