import React, { useState } from 'react';
import UserManagement from './UserManagement';
import UploadArtwork from './UploadArtwork';
import OrderManagement from './OrderManagement';
import './AdminPage.css';

const AdminDashboard = () => {
    const [activePage, setActivePage] = useState('dashboard');

    const renderContent = () => {
        switch (activePage) {
            case 'userManagement':
                return <UserManagement />;
            case 'uploadArtwork':
                return <UploadArtwork />;
            case 'orderManagement':
                return <OrderManagement />;
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
                    <li onClick={() => setActivePage('dashboard')} className={activePage === 'dashboard' ? 'active' : ''}>Dashboard Home</li>
                    <li onClick={() => setActivePage('userManagement')} className={activePage === 'userManagement' ? 'active' : ''}>Manage Users</li>
                    <li onClick={() => setActivePage('uploadArtwork')} className={activePage === 'uploadArtwork' ? 'active' : ''}>Upload Artwork</li>
                    <li onClick={() => setActivePage('orderManagement')} className={activePage === 'orderManagement' ? 'active' : ''}>Manage Orders</li>
                </ul>
            </div>
            <div className="dashboard-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;
