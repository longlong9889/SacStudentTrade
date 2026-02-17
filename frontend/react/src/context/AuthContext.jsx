import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";
import { login as performLogin } from "../services/client.js";
import jwtDecode from "jwt-decode";

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
    const [customer, setCustomer] = useState(null);

    const setCustomerFromToken = () => {
        const token = localStorage.getItem("access_token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setCustomer({
                    username: decoded.sub,
                    roles: decoded.scopes,
                    id: decoded.id || decoded.customerId || null,
                });
            } catch (e) {
                console.error("Failed to decode token:", e);
                localStorage.removeItem("access_token");
            }
        }
    };

    useEffect(() => {
        setCustomerFromToken();
    }, []);

    const login = async (usernameAndPassword) => {
        return new Promise((resolve, reject) => {
            performLogin(usernameAndPassword).then(res => {
                const jwtToken = res.headers["authorization"];
                localStorage.setItem("access_token", jwtToken);

                const decoded = jwtDecode(jwtToken);
                setCustomer({
                    username: decoded.sub,
                    roles: decoded.scopes,
                    id: decoded.id || decoded.customerId || null,
                });

                // Also store customerId for components that need it
                if (decoded.id || decoded.customerId) {
                    localStorage.setItem("customerId", decoded.id || decoded.customerId);
                }

                resolve(res);
            }).catch(err => {
                reject(err);
            });
        });
    };

    const logOut = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("customerId");
        setCustomer(null);
    };

    const isCustomerAuthenticated = () => {
        const token = localStorage.getItem("access_token");
        if (!token) return false;
        try {
            const { exp: expiration } = jwtDecode(token);
            if (Date.now() > expiration * 1000) {
                logOut();
                return false;
            }
            return true;
        } catch {
            logOut();
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{
            customer,
            login,
            logOut,
            isCustomerAuthenticated,
            setCustomerFromToken
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
