import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const register = async ({email, username, password}) => {
        const data = await api("/auth/register", {
            method: "POST",
            body: JSON.stringify({ 
                email, 
                username, 
                password})
        });
        return data;
    };

    const login = async ({email, password}) => {
        const data = await (api("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password })
        }));
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setToken(data.token);
        setUser(data.user);


        return data;import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Protected from './components/ProtectedRoute.jsx';
import  Login  from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import  Home  from './pages/home.jsx';
import { AuthProvider } from "./context/auth.jsx";
import Upload from "./pages/Upload.jsx";
import Profile from "./pages/Profile.jsx";
import ProfileEdit from './pages/ProfileEdit.jsx';



const App =() => {
  return (
    <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route
        path = "/"
        element = { <Protected> <Home /></Protected> }
        />

        <Route path = "/login" element = {<Login />} />
        <Route path = "/register" element = {<Register />}/>
        <Route path= "/upload" element= {<Protected><Upload /></Protected> }/>
        <Route path = "/users/:username" element={<Protected><Profile /></Protected>}/>
        <Route path= "/edit-profile" element={<Protected><ProfileEdit/> </Protected>}/>
        <Route path = "*" element = {<Navigate to = "/" replace />} />
      </Routes>
    </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

    };

    const updateUser = (updatedUser) => {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updateUser);
    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            isAuthenticated: Boolean(token),
            register,
            login,
            logout
        }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
}