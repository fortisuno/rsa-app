export default function handler(req, res) {
	const { plainText, publicKey } = req.body;

	// Valida si existe un texto plano y una llave publica
	if (plainText && publicKey) {
		// Libreria para el cifrado rsa
		const crypto = require("crypto");

		// Encripta el texto plano
		const encryptedData = crypto
			.publicEncrypt(
				{
					key: publicKey,
					padding: crypto.constants.RSA_PKCS1_PADDING
				},
				// Convierte el texto plano a un buffer de bits
				// y luego convierte a base64
				Buffer.from(plainText)
			)
			.toString("base64");

		// verifica qe sea metodo post
		switch (req.method) {
			case "POST":
				res.status(200).json({ encryptedData });
				break;
			default:
				res.setHeader("Allow", ["POST"]);
				res.status(405).end(`Method ${req.method} Not Allowed`);
		}
	} else {
		res.status(400).end(`Bad Request`);
	}
}
