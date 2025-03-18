import React, { useState, useEffect } from 'react';
import axios from '../../api/backend/index';
import Swal from 'sweetalert2';

const ProfileInfo = () => {
    const [user, setUser] = useState(null);
    const [updatedUser, setUpdatedUser] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`auth/profile`, {
                    headers: {
                        'Authorization': localStorage.getItem('Authorization'),
                        'Content-Type': 'application/json'
                    }
                });
                setUser(response.data);
                setUpdatedUser(response.data); // Initialize updated user data
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    useEffect(() => {
        if (user) {
            setUpdatedUser(user);
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setPreviewImage(URL.createObjectURL(file)); // Set preview image URL
    };

    const handleUpdateProfile = async () => {
        const formData = new FormData();
        formData.append('phone_number', updatedUser.Phone_Number || '');
        formData.append('bio', updatedUser.Bio || '');

        if (selectedFile) {
            formData.append('photo', selectedFile);
        }

        try {
            const response = await axios.put(`auth/users`, formData, {
                headers: {
                    'Authorization': localStorage.getItem('Authorization'),
                    'Content-Type': 'multipart/form-data'
                }
            });
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Profile updated successfully!',
                confirmButtonText: 'OK'
            });

            // Update state `user` dengan data terbaru
            setUser((prevUser) => ({
                ...prevUser,
                Phone_Number: updatedUser.Phone_Number,
                Bio: updatedUser.Bio,
                Photo: selectedFile ? URL.createObjectURL(selectedFile) : prevUser.Photo,
            }));

            setIsEditMode(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update profile. Please try again.',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div className="profile-info">
            {user ? (
                <div>
                    <img
                        src={previewImage || `http://localhost:8000/ARTM/images/user/${user.Photo}` || '/default-profile.png'}
                        alt="User Profile"
                        className="img-fluid rounded-circle mb-3"
                    />
                    {isEditMode ? (
                        <div>
                            <input
                                type="text"
                                name="Phone_Number"
                                value={updatedUser.Phone_Number}
                                onChange={handleInputChange}
                                placeholder="Phone Number"
                                className="form-control mb-2"
                            />
                            <textarea
                                name="Bio"
                                value={updatedUser.Bio || ''}
                                onChange={handleInputChange}
                                placeholder="Bio"
                                className="form-control mb-2"
                            />
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="form-control mb-2"
                            />
                            <button className="btn btn-success" onClick={handleUpdateProfile}>Save</button>
                            <button className="btn btn-secondary ml-2" onClick={() => setIsEditMode(false)}>Cancel</button>
                        </div>
                    ) : (
                        <div>
                            <ul className="list-group">
                                <li className="list-group-item"><strong>Email:</strong> {user.Email}</li>
                                <li className="list-group-item"><strong>Phone Number:</strong> {user.Phone_Number}</li>
                                <li className="list-group-item"><strong>Bio:</strong> {user.Bio || 'No bio available'}</li>
                                <li className="list-group-item"><strong>User Type:</strong> {user.User_Type}</li>
                            </ul>
                            <button className="btn btn-primary mt-3" onClick={() => setIsEditMode(true)}>Edit Profile</button>
                        </div>
                    )}
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
};

export default ProfileInfo;
