import React, { useState } from 'react';
import axios from '../../api/backend/index';
import Swal from 'sweetalert2';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone_number: '',
        password: '',
        artist_name: '',
        bio: '',
        user_type: 'Customer'
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null); // State untuk pratinjau gambar
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);

        // Set pratinjau gambar jika file dipilih
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setProfilePreview(null);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formPayload = new FormData();
        Object.keys(formData).forEach((key) => {
            formPayload.append(key, formData[key]);
        });
        if (profilePicture) {
            formPayload.append('photo', profilePicture);
        }

        try {
            const response = await axios.post('/auth/register', formPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Registration Successful',
                text: response.data.message,
                confirmButtonColor: '#C15A01'
            }).then(() => {
                window.location.href = '/login'; // Redirect to login page after success
            });

            setFormData({
                username: '',
                email: '',
                phone_number: '',
                password: '',
                artist_name: '',
                bio: '',
                user_type: 'Customer'
            });
            setProfilePicture(null);
            setProfilePreview(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            {loading ? (
                <div className="spinner"></div>
            ) : (
                <div className="register-form-container">
                    <h2>Register</h2>
                    {error && <p className="error-message">{error}</p>}
                    <form onSubmit={handleRegister} className="register-form">
                        <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Phone Number"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                        <textarea
                            placeholder="Bio (Optional)"
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                        />
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="file-input"
                        />
                        {profilePreview && (
                            <div className="image-preview-container">
                                <img src={profilePreview} alt="Profile Preview" className="image-preview" />
                            </div>
                        )}
                        <button type="submit" className="register-button">Register</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Register;
