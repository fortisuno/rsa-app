import React from "react";

export const Loading = () => {
	return (
		<div className="vh-100 w-100 position-relative">
			<div className="position-absolute start-50 top-50 translate-middle">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		</div>
	);
};
