import React, { useEffect, useState } from 'react'
import { Formik, Form, Field } from 'formik'
import Link from 'next/link'
import { useAuth } from '../utils/auth'
import { useRouter } from 'next/router'
import { Loading } from '../components/Loading'
import { FloatingLabel } from '../components/FloatingLabel'

export default function CreateAccount() {
	const [state, setState] = useState({success: false, loading: true})
	const [isLogged, setIsLogged] = useState(null)
	const { session, registerUser } = useAuth();
	const router = useRouter()

	const { success, loading } = state

	useEffect(() => {
		if(!session.loading && !session.data) {
			setTimeout(() => {
			  setIsLogged(false)
			}, 1000)
		 } else if(!session.loading && session.data){
			router.replace('/')
		 }
	}, [session, router])

	const handleSubmit = (values, {resetForm, setSubmitting}) => {
		const {email, password} = values

		registerUser(email, password)
			.then(() => {
				resetForm();
				setState({
					success: true,
					loading: false
				})
				setTimeout(() => {
					router.push('/login');
				}, 2000)
				console.log('Usuario registrado...')
			}).catch(() => {
				setState((prev) => ({
					...prev,
					loading: false
				}))
				setSubmitting(false)
				console.log('No se puede registrar este usuario...')
			})

	}

	return isLogged !== null && !isLogged ? (
		<div className="bg-light vh-100 p-5">
			<div className="container h-100 position-relative">
				<div className="row h-100 justify-content-center align-items-center">
					<div className="col-4 text-center">
						<div className="vstack gap-5">
							<h1>Crear cuenta</h1>
							
							<Formik
								initialValues={{
									email: '',
									password: '',
									passwordConfirm: ''
								}}
								validate={values => {
									const errors = {};
									
									if (!values.email) {
										errors.email = 'Este campo es requerido';
									} else if (
										!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
									) {
										errors.email = 'Inserta un correo valido';
									}

									if(!values.password) {
										errors.password = 'Este campo es requerido';
									}

									if(!values.passwordConfirm) {
										errors.passwordConfirm = 'Este campo es requerido';
									} else if(values.passwordConfirm !== values.password) {
										errors.password = 'La contraseña no coincide'
										errors.passwordConfirm = 'La contraseña no coincide'
									}

									return errors;
								}}
								onSubmit={ handleSubmit }
							>
								{({isSubmitting}) => (
									<Form className="d-grid gap-3">
										<Field type="email" name="email" placeholder="Coreo" label="Correo" component={ FloatingLabel } />
										<Field type="password" name="password"  placeholder="Contraseña" label="Contraseña" component={ FloatingLabel }/>
										<Field type="password" name="passwordConfirm"  placeholder="Confirmar contraseña" label="Confirmar contraseña" component={ FloatingLabel }/>
										<button type="submit" className="btn btn-lg btn-primary mt-5" style={{borderRadius: '10px'}} disabled={ isSubmitting || success }>Registrar usuario</button>
										<Link href="/login"><a className={"fs-5 w-auto btn btn-link" + (isSubmitting || success ? ' disabled' : '')} style={{borderRadius: '10px'}}>Iniciar sesión</a></Link>
									</Form>
								)}
							</Formik>
						</div>
						{!loading && success && (
							<span className="alert alert-success col-4 position-absolute translate-middle bottom-0 start-50" style={{borderRadius: '10px'}}>
								Usuario Registrado
							</span>
						)}
						{!loading && !success && (
							<span className="alert alert-danger col-4 position-absolute translate-middle bottom-0 start-50" style={{borderRadius: '10px'}}>
								No se puede registrar este usuario
							</span>
						)}
					</div>
				</div>
			</div>
    	</div>
	): <Loading />
}