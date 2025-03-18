import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserManagement from './UserManagement';
import UploadArtwork from './UploadArtwork';
import OrderManagement from './OrderManagement';
import UploadNewsEvent from './UploadNewsEvent'; 
import './AdminPage.css';
import ListArtworkCustom from './ListArtworkCustom';

const AdminDashboard = () => {
    const [activePage, setActivePage] = useState('dashboard');
    const [user, setUser] = useState(null); // Simpan user di state
    const navigate = useNavigate();

    useEffect(() => {
        // Ambil JWT token dari localStorage
        const token = localStorage.getItem('Authorization')?.split(' ')[1]; // Hapus 'Bearer ' dari token
        if (!token) {
            console.warn('Token tidak ditemukan. Redirecting...');
            navigate('/'); // Redirect jika tidak ada token
            return;
        }

        try {
            // Dekode payload dari token
            const payload = JSON.parse(atob(token.split('.')[1])); // Ambil bagian kedua (payload) dan dekode
            // Simpan user ke state
            setUser({
                id: payload.id,
                name: payload.name,
                role: payload.role, // Ambil role dari payload
            });

            // Pastikan hanya admin yang bisa mengakses
            if (payload.role !== 'Admin') {
                console.warn('User bukan admin. Redirecting...');
                navigate('/'); // Redirect jika bukan admin
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            navigate('/'); // Redirect jika token tidak valid
        }
    }, [navigate]);

    const renderContent = () => {
        switch (activePage) {
            case 'userManagement':
                return <UserManagement />;
            case 'uploadArtwork':
                return <UploadArtwork />;
            case 'orderManagement':
                return <OrderManagement />;
            case 'uploadNewsEvent': // Tambahkan case untuk UploadNewsEvent
                return <UploadNewsEvent />;
            case 'listartworkcustom': // Tambahkan case untuk UploadNewsEvent
            return <ListArtworkCustom/>;
            default:
                return (
                    <div className="welcome-section">
                        <h2>Welcome to the Admin Dashboard</h2>
                        <p>Manage your platform efficiently with tools for user management, artwork uploads, and order management.</p>
                        <p>Select an option from the menu to get started!</p>
                    </div>
                );
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="sidebar">
                <h3>Admin Menu</h3>
                <ul>
                    <li
                        onClick={() => setActivePage('dashboard')}
                        className={activePage === 'dashboard' ? 'active' : ''}
                    >
                        Dashboard Home
                    </li>
                    <li
                        onClick={() => setActivePage('userManagement')}
                        className={activePage === 'userManagement' ? 'active' : ''}
                    >
                        Manage Users
                    </li>
                    <li
                        onClick={() => setActivePage('uploadArtwork')}
                        className={activePage === 'uploadArtwork' ? 'active' : ''}
                    >
                        Upload Artwork
                    </li>
                    <li
                        onClick={() => setActivePage('listartworkcustom')}
                        className={activePage === 'listartworkcustom' ? 'active' : ''}
                    >
                        List Artwork Custom
                    </li>
                    <li
                        onClick={() => setActivePage('orderManagement')}
                        className={activePage === 'orderManagement' ? 'active' : ''}
                    >
                        Manage Orders
                    </li>
                    <li
                        onClick={() => setActivePage('uploadNewsEvent')}
                        className={activePage === 'uploadNewsEvent' ? 'active' : ''}
                    >
                        Upload News and Event
                    </li>
                </ul>
            </div>
            <div className="dashboard-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;
