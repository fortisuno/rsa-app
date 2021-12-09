import React from 'react'
import { Formik, Form, Field } from 'formik'
import Link from 'next/link' 

export default function Login() {
	return (
		<div className="bg-light vh-100 p-5">
			<div className="row h-100 justify-content-center align-content-center">
				<div className="col-3 text-center">

					<div className="vstack gap-5">
						<h1>Iniciar sesión</h1>
						
						<Formik
							initialValues={{email: '', password: ''}}
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

								return errors;
							}}
						>
							{() => (
								<Form className="d-grid gap-3">
										<Field type="email" name="email" placeholder="name@example.com" label="Correo" component={ FloatingLabel } />
										<Field type="password" name="password" placeholder="name@example.com" label="Contraseña" component={ FloatingLabel }/>
									<button type="submit" className="btn btn-lg btn-primary mt-5" style={{borderRadius: '10px'}}>Iniciar sesión</button>
									<Link href="/create-account"><a className="fs-5 w-auto" style={{borderRadius: '10px'}}>Crear cuenta</a></Link>
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