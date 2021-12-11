/**
 * Equipo 4
 * Hernández Ayala Oscar Uriel
 * Ibarra Ibarra Alexis
 * Gomez Garcia Jovani
 * Gómez Morales Pablo Arturo
 *
 */

import axios from "axios";
import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import JSZip from "jszip";

import { FileUpload } from "../components/FileUpload";
import { useAuth } from "../utils/auth";
import { Loading } from "../components/Loading";
import { useRouter } from "next/router";
import { Modal } from "react-bootstrap";
import { ErrorMessage, Field, Form, Formik } from "formik";

export async function getServerSideProps() {
	// Libreria para generar las llaves
	const crypto = require("crypto");

	// Genera las llaves publica y privada
	const defaultKeyPair = crypto.generateKeyPairSync("rsa", {
		modulusLength: 4096, // Tamaño de las llaves
		publicKeyEncoding: {
			type: "pkcs1", // Tipo de llave publica
			format: "pem" // Formato en que se genera la llave privada
		},
		privateKeyEncoding: {
			type: "pkcs8", // Tipo de llave privada
			format: "pem" // Formato en que se genera la llave privada
		}
	});

	return {
		props: {
			defaultKeyPair
		}
	};
}

export default function Home({ defaultKeyPair }) {
	const [customKeyPair, setCustomKeyPair] = useState(null); // Llaves especificadas por el usuario
	const [decryptedData, setDecryptedData] = useState(""); // Mensaje encriptado
	const [show, setShow] = useState(false);
	const [isLogged, setIsLogged] = useState(false);
	const router = useRouter();
	const {
		session: { data, loading },
		logout
	} = useAuth();

	useEffect(() => {
		if (!loading && data) {
			setTimeout(() => {
				setIsLogged(true);
			}, 1000);
		} else if (!loading && !data) {
			router.replace("/login");
		}
	}, [loading, data, router]);

	// Encripta un archivo txt
	const handleEncrypt = (files) => {
		const file = files[0]; // Elige el archivo del input file
		const reader = new FileReader(); // Crea un lector de archivos

		reader.readAsText(file); // Lee el archivo del input file
		reader.onload = () => {
			// Hace la peticion para encriptar a la API
			// pidiendo como parametros el texto plano y
			// la llave publica
			axios
				.post("/api/encrypt", {
					plainText: reader.result,
					publicKey: customKeyPair ? customKeyPair.publicKey : defaultKeyPair.publicKey

					// Si todo sale bien entonces...
				})
				.then(({ data }) => {
					// Se obtiene el mensaje cifrado
					const encryptedData = data.encryptedData;

					// Se genera un nuevo archivo
					const encryptedFile = new File([encryptedData], "encrypted.rsa", {
						type: "text/plain;charset=utf-8"
					});

					// Se descarga el archivo cifrado
					saveAs(encryptedFile);
				});
		};
	};

	// Desencripta un archivo rsa
	const handleDecrypt = (files) => {
		const file = files[0]; // Elige el archivo del input file
		const reader = new FileReader(); // Crea un lector de archivos

		reader.readAsText(file); // Lee el archivo del input file
		reader.onload = () => {
			// Hace la peticion para encriptar a la API
			// pidiendo como parametros el texto cifrado y
			// la llave privada
			axios
				.post("/api/decrypt", {
					encryptedData: reader.result,
					privateKey: customKeyPair ? customKeyPair.privateKey : defaultKeyPair.privateKey

					// Si todo sale bien entonces muestra el texto plano
				})
				.then(({ data }) => {
					// console.log(data.decryptedData)
					setDecryptedData(data.decryptedData);
				})
				.catch(() => {
					setDecryptedData("No se pudo desencriptar el mensaje...");
				});
		};
	};

	// Exporta las llaves publica y privada en
	// formato pem y las empaqueta en un zip
	const handleExportKeyPair = async () => {
		const zip = new JSZip();

		zip.file("publicKey.pem", defaultKeyPair.publicKey);
		zip.file("privateKey.pem", defaultKeyPair.privateKey);

		const file = await zip.generateAsync({ type: "blob" });

		saveAs(file, "keyPair.zip");
	};

	const handleImportKeyPair = (values, { resetForm }) => {
		setCustomKeyPair(values);
		resetForm();
		setShow(false);
	};

	const handleLogout = () => {
		logout()
			.then(() => {
				router.reload();
			})
			.catch(() => {
				console.log("Hubo un error de comunicacion...");
			});
	};

	const handleClose = () => setShow(false);

	const handleShow = () => setShow(true);

	return isLogged ? (
		<div>
			<div className="bg-light p-5">
				<div className="container">
					<div className="d-flex py-3 gap-3 mb-5 justify-content-between">
						<div className="d-flex gap-3">
							<button
								className="btn btn-sm btn-success rounded-pill px-3"
								onClick={handleExportKeyPair}
							>
								Exportar llaves
							</button>
							<button
								className="btn btn-sm btn-secondary rounded-pill px-3"
								onClick={handleShow}
							>
								Importar llaves
							</button>
						</div>
						<div className="d-flex gap-3 align-items-center">
							<h6 className="fw-bold">{data.email}</h6>
							<button
								className="btn btn-sm btn-danger rounded-pill px-3"
								onClick={handleLogout}
							>
								Cerrar sesión
							</button>
						</div>
					</div>
					<div className="row min-vh-100 justify-content-center">
						<div className="col-5 text-center">
							<div className="vstack gap-4">
								<div className="mb-5">
									<h1 className="display-2 fw-normal mb-0">RSA</h1>
									<h3 className="text-muted">Equipo 4</h3>
								</div>
								<FileUpload
									id="encrypt"
									className="btn d-block btn-lg btn-primary"
									callback={handleEncrypt}
									accept=".txt"
								>
									Encriptar
								</FileUpload>
								<div className="d-flex align-items-center">
									<hr className="w-100" />
									<span className="mx-3 fs-5">ó</span>
									<hr className="w-100" />
								</div>
								<FileUpload
									id="decrypt"
									className="btn d-block btn-lg btn-secondary"
									callback={handleDecrypt}
									accept=".rsa"
								>
									Desencriptar
								</FileUpload>
								<pre
									className="bg-white border mx-auto p-3 mt-5 text-start"
									style={{ width: "100%", minHeight: 360, borderRadius: "10px" }}
								>
									{decryptedData}
								</pre>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Importar Llaves</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Formik
						initialValues={{
							publicKey: "",
							privateKey: ""
						}}
						validate={({ publicKey, privateKey }) => {
							const errors = {};

							if (!publicKey) {
								errors.publicKey = "Este campo es requerido";
							}

							if (!privateKey) {
								errors.privateKey = "Este campo es requerido";
							}

							return errors;
						}}
						onSubmit={handleImportKeyPair}
					>
						{({ errors, isSubmitting }) => (
							<Form className="vstack gap-4">
								<div>
									<h5 htmlFor="publicKey" className="mb-3">
										Llave publica
									</h5>
									<Field
										name="publicKey"
										placeholder="Introduce tu llave publica..."
										rows="5"
										className={"form-control" + (errors.publicKey ? " is-invalid" : "")}
										style={{ borderRadius: "10px" }}
										component="textarea"
									/>
									<ErrorMessage
										name="publicKey"
										component={() => (
											<span className="d-block text-danger p-1">
												{" "}
												{errors.publicKey}{" "}
											</span>
										)}
									/>
								</div>
								<div>
									<h5 htmlFor="privateKey" className="mb-3">
										Llave privada
									</h5>
									<Field
										name="privateKey"
										placeholder="Introduce tu llave privada..."
										rows="10"
										className={"form-control" + (errors.publicKey ? " is-invalid" : "")}
										style={{ borderRadius: "10px" }}
										component="textarea"
									/>
									<ErrorMessage
										name="privateKey"
										component={() => (
											<span className="d-block text-danger p-1">
												{" "}
												{errors.publicKey}{" "}
											</span>
										)}
									/>
								</div>
								<button
									type="submit"
									className="btn btn-primary mt-4"
									style={{ borderRadius: "10px" }}
									disabled={isSubmitting}
								>
									Importar
								</button>
							</Form>
						)}
					</Formik>
				</Modal.Body>
			</Modal>
		</div>
	) : (
		<Loading />
	);
}
