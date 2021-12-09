const crypto = require("crypto")

export const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
	// The standard secure default length for RSA keys is 2048 bits
	modulusLength: 4096,
	publicKeyEncoding: {
		type: 'pkcs1',
		format:'pem'
	},
	privateKeyEncoding: {
		type: 'pkcs8',
		format:'pem'
	}
})

const data = "my secret data"

const encryptedData = crypto.publicEncrypt(
	{
		key: publicKey,
		padding: crypto.RSA_NO_PADDING
	},
	// We convert the data string to a buffer using `Buffer.from`
	Buffer.from(data)
)

console.log("encypted data: ", encryptedData.toString("base64"))

const decryptedData = crypto.privateDecrypt(
	{
		key: privateKey,
		padding: crypto.RSA_NO_PADDING
	},
	encryptedData
)

console.log("\ndecrypted data: ", decryptedData.toString())