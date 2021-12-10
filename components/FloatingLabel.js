export const FloatingLabel = ({
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