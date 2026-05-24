import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useAuth } from '../context/auth.jsx';

const Login = () => {
    const navigate = useNavigate();
    const {login} = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await login(form);
            navigate("/");
        }catch(err) {
            setError(err.message);
        }
    };
    return (
        <main>
            <h1>Login</h1>
            <form onSubmit = {handleSubmit}>
                <input
                name = "email"
                type = "email"
                placeholder = "Email"
                value = {form.email}
                onChange = {handleChange}
                />

                <input
                name = "password"
                type = "password"
                placeholder = "Password"
                value = {form.password}
                onChange = {handleChange}
                />
                {error && <p>{error}</p>}

                <button type = "submit">Login</button>
            </form>

            <p>Don't have an account yet?<Link to = "/register">Sign up here</Link></p>
        </main>
    );

    }

export default Login;
