import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../utils/auth";
import { Loading } from "../components/Loading";
import { FloatingLabel } from "../components/FloatingLabel";

export default function Login() {
	const [state, setState] = useState({ success: false, loading: true });
	const [isLogged, setIsLogged] = useState(null);
	const { session, login } = useAuth();
	const router = useRouter();

	const { success, loading } = state;

	useEffect(() => {
		if (!session.loading && !session.data) {
			setTimeout(() => {
				setIsLogged(false);
			}, 1000);
		} else if (!session.loading && session.data) {
			router.replace("/");
		}
	}, [session, router]);

	const handleSubmit = (values, { resetForm, setSubmitting }) => {
		const { email, password } = values;

		login(email, password)
			.then(() => {
				resetForm();
				setState({
					success: true,
					loading: false
				});
				console.log("Usuario loggeado...");
				router.push("/");
			})
			.catch(() => {
				setState((prev) => ({
					...prev,
					loading: false
				}));
				setSubmitting(false);
				console.log("Usuario o contraseña incorrectos");
			});
	};
	return isLogged !== null && !isLogged ? (
		<div className="bg-light vh-100 p-5">
			<div className="row h-100 justify-content-center align-content-center">
				<div className="col-3 text-center">
					<div className="vstack gap-5">
						<h1>Iniciar sesión</h1>

						<Formik
							initialValues={{ email: "", password: "" }}
							validate={(values) => {
								const errors = {};

								if (!values.email) {
									errors.email = "Este campo es requerido";
								} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
									errors.email = "Inserta un correo valido";
								}

								if (!values.password) {
									errors.password = "Este campo es requerido";
								}

								return errors;
							}}
							onSubmit={handleSubmit}
						>
							{({ isSubmitting }) => (
								<Form className="d-grid gap-3">
									<Field
										type="email"
										name="email"
										placeholder="name@example.com"
										label="Correo"
										component={FloatingLabel}
									/>
									<Field
										type="password"
										name="password"
										placeholder="name@example.com"
										label="Contraseña"
										component={FloatingLabel}
									/>
									<button
										type="submit"
										className="btn btn-lg btn-primary mt-5"
										style={{ borderRadius: "10px" }}
										disabled={isSubmitting}
									>
										Iniciar sesión
									</button>
									<Link href="/create-account">
										<a
											role="button"
											className={
												"fs-5 w-auto btn btn-link" +
												(isSubmitting || success ? " disabled" : "")
											}
											style={{ borderRadius: "10px" }}
										>
											Crear cuenta
										</a>
									</Link>
								</Form>
							)}
						</Formik>
					</div>
					{!loading && !success && (
						<span
							className="alert alert-danger col-4 position-absolute translate-middle bottom-0 start-50"
							style={{ borderRadius: "10px" }}
						>
							Usuario o contraseña incorrectos
						</span>
					)}
				</div>
			</div>
		</div>
	) : (
		<Loading />
	);
}
