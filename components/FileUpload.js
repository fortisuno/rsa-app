import React, { useRef, useState } from 'react'

export const FileUpload = ({ id, callback, children, className, accept }) => {

	const upload = useRef()

	const handleChange = () => {
		callback(upload.current.files)
		upload.current.value = ''
	}

	return (
		<div>
			<input type="file" role="button" id={id} onChange={ handleChange } ref={upload} accept={accept} hidden/>
			<label className={className} htmlFor={id} style={{borderRadius: '10px'}}>{children}</label>
		</div>
	)
}
