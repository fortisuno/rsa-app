import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "../utils/auth";

function MyApp({ Component, pageProps }) {
	return (
		<AuthProvider>
			<Component {...pageProps} />
		</AuthProvider>
	);
}

export default MyApp;
