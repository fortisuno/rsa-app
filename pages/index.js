import axios from "axios";
import { useState } from "react";
import { saveAs } from "file-saver";
import JSZip from "jszip";

import { FileUpload } from "../components/FileUpload";

export async function getServerSideProps() {

  // Libreria para generar las llaves
  const crypto = require('crypto')

  // Genera las llaves publica y privada
  const defaultKeyPair = crypto.generateKeyPairSync("rsa", {
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

  return {
    props: {
      defaultKeyPair
    },
  }
}

export default function Home({ defaultKeyPair }) {
  
  const [customKeyPair, setCustomKeyPair] = useState(null)    // Llaves especificadas por el usuario
  const [decryptedData, setDecryptedData] = useState('')      // Mensaje encriptado

  // Encripta un archivo txt
  const handleEncrypt = (files) => {

    const file = files[0]                 // Elige el archivo del input file
    const reader = new FileReader()       // Crea un lector de archivos
    
    reader.readAsText(file)               // Lee el archivo del input file
    reader.onload = () => {

      // Hace la peticion para encriptar a la API
      // pidiendo como parametros el texto plano y
      // la llave publica
      axios.post('/api/encrypt', {
        plainText: reader.result,
        publicKey: defaultKeyPair.publicKey
      
        // Si todo sale bien entonces...
      }).then(({ data }) => {

        // Se obtiene el mensaje cifrado
        const encryptedData = data.encryptedData

        // Se genera un nuevo archivo
        const encryptedFile = new File([encryptedData], "encrypted.rsa", {
          type: "text/plain;charset=utf-8"
        })

        // Se descarga el archivo cifrado
        saveAs(encryptedFile)
      })

    }
  }

  // Desencripta un archivo rsa
  const handleDecrypt = (files) => {

    const file = files[0]                 // Elige el archivo del input file
    const reader = new FileReader()       // Crea un lector de archivos
    
    reader.readAsText(file)               // Lee el archivo del input file
    reader.onload = () => {

      // Hace la peticion para encriptar a la API
      // pidiendo como parametros el texto cifrado y
      // la llave privada
      axios.post('/api/decrypt', {
        encryptedData: reader.result,
        privateKey: defaultKeyPair.privateKey

        // Si todo sale bien entonces muestra el texto plano
      }).then(({ data }) => {

        // console.log(data.decryptedData)
        setDecryptedData(data.decryptedData)

      })

    }

  }

  // Exporta las llaves publica y privada en
  // formato pem y las empaqueta en un zip
  const handleExportKeyPair = async() => {
    const zip = new JSZip();

    zip.file('publicKey.pem', defaultKeyPair.publicKey)
    zip.file('privateKey.pem', defaultKeyPair.privateKey)

    const file = await zip.generateAsync({type:"blob"})

    saveAs(file, 'keyPair.zip')
  }

  const handleImportKeyPair = (e) => {
    e.preventDefault()
    const publicKey = document.getElementById('publicKey')
    const privateKey = document.getElementById('privateKey')
    
    setCustomKeyPair({
      publicKey: publicKey.value,
      privateKey: privateKey.value
    })

  }
  
  return (
    <div className="bg-light p-5">
      <div className="container">
        <div className="row min-vh-100 justify-content-center">
          <div className="col-5 text-center">

            <div className="vstack gap-4">
                <div className="mb-5">
                  <h1 className="display-2 fw-normal mb-0">RSA</h1>
                  <h3 className="text-muted">Equipo 4</h3>
                </div>
                <FileUpload id="encrypt" className="btn d-block btn-lg btn-primary" callback={ handleEncrypt } accept=".txt">
                  Encriptar
                </FileUpload>
                <div className="d-flex align-items-center">
                  <hr className="w-100"/>
                  <span className="mx-3 fs-5">ó</span>
                  <hr className="w-100"/>
                </div>
                <FileUpload id="decrypt" className="btn d-block btn-lg btn-secondary" callback={ handleDecrypt } accept=".rsa">
                  Desencriptar
                </FileUpload>
                <pre className="bg-white border mx-auto p-3 mt-5" style={{ width: '100%', minHeight: 360, borderRadius: '10px' }}>
                  {decryptedData}
                </pre>
              </div>
            </div>

          </div>
        </div>
      </div>
  )
}
