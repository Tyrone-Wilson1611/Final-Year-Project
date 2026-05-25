import {useState} from 'react';
import { useAuth } from '../context/auth.jsx';
import { Link, useNavigate } from 'react-router-dom';


const Register =() => {
    const navigate = useNavigate();
    const {register} = useAuth();

    const [form, setForm] = useState({
        email: "",
        username: "",
        password: ""
    });

    const [error, setError] = useState(null);

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
            await register(form);
            navigate("/login");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-panel">
            <h1 className="auth-title">PhotoPort</h1>
            <p className="auth-subtitle">User Registration</p>

            <form onSubmit={handleSubmit} className="auth-form">
                <input 
                name = "username"
                placeholder = "Username"
                value = {form.username}
                onChange = {handleChange}
                />
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

                <button type = "submit">Create</button>
                </form>

                <p className="auth-switch">Already have an account? <Link to="/login">Login here</Link></p>
                  </section>
        </main>
    )
}

export default Register;