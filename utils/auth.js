import { createContext, useContext, useEffect, useState } from "react";
import {
	createUserWithEmailAndPassword,
	getAuth,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut
} from "firebase/auth";
import { app } from "./firebase";

const AuthContext = createContext();

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
	const [session, setSession] = useState({ data: null, loading: true });

	const auth = getAuth(app);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (data) => {
			if (data) {
				setSession({
					data,
					loading: false
				});
			} else {
				setSession((prev) => ({
					...prev,
					loading: false
				}));
			}
		});

		return () => unsubscribe();
	}, [auth]);

	const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

	const logout = () => signOut(auth);

	const registerUser = (email, password) => createUserWithEmailAndPassword(auth, email, password);

	return (
		<AuthContext.Provider
			value={{
				session,
				login,
				logout,
				registerUser
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export { useAuth, AuthProvider };
