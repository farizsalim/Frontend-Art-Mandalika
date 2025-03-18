import React, { useEffect, useState } from 'react';
import axios from '../../api/backend/index';
import Swal from 'sweetalert2';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [updatedRole, setUpdatedRole] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/auth/users', {
                headers: { 'Authorization': localStorage.getItem('Authorization') }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'This action cannot be undone!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel'
            });

            if (result.isConfirmed) {
                await axios.delete(`/auth/users/${userId}`, {
                    headers: { 'Authorization': localStorage.getItem('Authorization') }
                });
                Swal.fire('Deleted!', 'The user has been deleted.', 'success');
                fetchUsers();
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            Swal.fire('Error', 'Failed to delete user. Please try again.', 'error');
        }
    };

    const handleUpdateUserRole = async () => {
        if (!updatedRole) {
            Swal.fire('Error', 'Please specify a role.', 'warning');
            return;
        }
    
        try {
            await axios.patch(`/auth/users/${selectedUser.ID_User}/user-type`, { user_type: updatedRole }, {
                headers: { 'Authorization': localStorage.getItem('Authorization') }
            });
            Swal.fire('Success', 'User role updated successfully!', 'success');
            setSelectedUser(null);
            setUpdatedRole('');
            fetchUsers();
        } catch (error) {
            console.error('Error updating user role:', error);
            Swal.fire('Error', 'Failed to update user role. Please try again.', 'error');
        }
    };

    const closeRoleUpdateModal = () => {
        setSelectedUser(null);
        setUpdatedRole('');
    };

    return (
        <div className="user-management">
            <h2>User Management</h2>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>User Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.ID_User}>
                            <td>{user.ID_User}</td>
                            <td>{user.Username}</td>
                            <td>{user.Email}</td>
                            <td>{user.Phone_Number}</td>
                            <td>{user.User_Type}</td>
                            <td>
                                <button
                                    className="action-btn update-role-btn"
                                    onClick={() => setSelectedUser(user)}
                                >
                                    Update Role
                                </button>
                                <button
                                    className="action-btn delete-btn"
                                    onClick={() => handleDeleteUser(user.ID_User)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedUser && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-btn" onClick={closeRoleUpdateModal}>
                            &times;
                        </span>
                        <h3>Update Role for {selectedUser.Username}</h3>
                        <div className="modal-body">
                            <label>
                                Select New Role:
                                <select
                                    value={updatedRole}
                                    onChange={(e) => setUpdatedRole(e.target.value)}
                                    className="role-select"
                                >
                                    <option value="">Select Role</option>
                                    <option value="Customer">Customer</option>
                                    <option value="Artist">Artist</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </label>
                        </div>
                        <div className="modal-actions">
                            <button
                                className="save-btn"
                                onClick={handleUpdateUserRole}
                            >
                                Save Changes
                            </button>
                            <button
                                className="cancel-btn"
                                onClick={closeRoleUpdateModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
