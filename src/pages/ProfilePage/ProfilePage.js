import React, { useEffect, useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import axios from '../../api/backend/index';
import ProfileInfo from './ProfileInfo'; // Komponen untuk informasi pengguna
import AddressList from './AddressList'; // Komponen untuk daftar alamat
import SecuritySettings from './SecuritySettings'; // Komponen untuk pengaturan keamanan
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Profile.css';

const ProfilePage = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('auth/profile', {
                    headers: {
                        'Authorization': localStorage.getItem('Authorization'),
                        'Content-Type': 'application/json'
                    }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    return (
        <div className="profile-page container mt-5 mb-5">
            <div className="card shadow-sm">
                <div className="card-header">
                    <h2 className="profile-page-title">{user?.Username || 'User Profile'}</h2>
                </div>
                <div className="card-body">
                    <Tabs defaultActiveKey="profileInfo" id="profile-tabs">
                        <Tab eventKey="profileInfo" title="Profile Information">
                            <ProfileInfo user={user} />
                        </Tab>
                        <Tab eventKey="addresses" title="Addresses">
                            <AddressList />
                        </Tab>
                        <Tab eventKey="security" title="Security Settings">
                            <SecuritySettings />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
