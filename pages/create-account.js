import React from 'react'
import { Formik, Form, Field } from 'formik'
import Link from 'next/link' 

export default function CreateAccount() {
	return (
		<div className="bg-light vh-100 p-5">
			<div className="row h-100 justify-content-center align-content-center">
				<div className="col-4 text-center">

					<div className="vstack gap-5">
						<h1>Crear cuenta</h1>
						
						<Formik
							initialValues={{
								firstname: '',
								lastname: '',
								email: '',
								password: '',
								passwordConfirm: ''
							}}
							validate={values => {
								const errors = {};

								if(!values.firstname) {
									errors.firstname = 'Este campo es requerido';
								}

								if(!values.lastname) {
									errors.lastname = 'Este campo es requerido';
								}
								
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
						>
							{() => (
								<Form className="d-grid gap-3">
										<div className="row">
											<div className="col">
												<Field type="text" name="firstname" placeholder="Nombre" label="Nombre" component={ FloatingLabel } />
											</div>
											<div className="col">
												<Field type="text" name="lastname" placeholder="Apellido" label="Apellido" component={ FloatingLabel } />
											</div>
										</div>
										<Field type="email" name="email" placeholder="Coreo" label="Correo" component={ FloatingLabel } />
										<Field type="password" name="password"  placeholder="Contraseña" label="Contraseña" component={ FloatingLabel }/>
										<Field type="password" name="passwordConfirm"  placeholder="Confirmar contraseña" label="Confirmar contraseña" component={ FloatingLabel }/>
									<button type="submit" className="btn btn-lg btn-primary mt-5" style={{borderRadius: '10px'}}>Iniciar sesión</button>
									<Link href="/login"><a className="fs-5 w-auto" style={{borderRadius: '10px'}}>Iniciar sesión</a></Link>
								</Form>
							)}
						</Formik>
					</div>

				</div>
			</div>
    	</div>
	)
}

const FloatingLabel = ({
   field, 
   form: { touched, errors }, 
   ...props
 }) => (
	<div className="form-floating">
		<input className={"form-control" + (touched[field.name] && errors[field.name] ? ' is-invalid' : '')} style={{borderRadius: '10px'}} id={ props.name } {...field} {...props} />
		<label htmlFor={ props.name }>{props.label || ''}</label>
		{touched[field.name] && errors[field.name] && <span className="d-block p-1 w-100 text-start text-danger">{errors[field.name]}</span>}
	</div>
)