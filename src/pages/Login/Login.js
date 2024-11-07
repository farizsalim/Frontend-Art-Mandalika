import React, { useState } from 'react';
import axios from '../../api/backend/index';
import Swal from 'sweetalert2';
import { useNavigate, NavLink } from 'react-router-dom';
import './Login.css';
import welcomeImage from '../../assets/2.jpg'; // Ganti dengan path gambar Anda

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post('/auth/login', {
                email,
                password
            });

            // Mengambil token dan data pengguna dari respons API
            const { token, user } = response.data;

            // Simpan token dan informasi pengguna di localStorage
            localStorage.setItem("Authorization", `Bearer ${token}`);

            // Tampilkan notifikasi sukses
            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: `Welcome back, ${user.username}!`,
                confirmButtonColor: '#C15A01'
            }).then(() => {
                window.location.href = '/';
            });

            // Reset input form
            setEmail("");
            setPassword("");
        } catch (err) {
            setError("Login failed. Please check your email and password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {loading ? (
                <div className="spinner"></div>
            ) : (
                <div className="login-box">
                    <div className="login-welcome">
                        <img src={welcomeImage} alt="Welcome" className="welcome-image" />
                        <h2>Welcome Back!</h2>
                        <p>Don't have an account yet? Register to join us!</p>
                        <NavLink to="/register"><button className="login-button">Register</button></NavLink> 
                    </div>
                    <div className="login-form">
                        <h2>LOGIN</h2>
                        {error && <p className="error-message">{error}</p>}
                        <form onSubmit={handleLogin}>
                            <input 
                                type="email" 
                                placeholder="Email" 
                                className="login-input" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                className="login-input" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                            <button type="submit" className="signup-button">SIGN IN</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
