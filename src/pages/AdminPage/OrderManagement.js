import React, { useEffect, useState } from 'react';
import axios from '../../api/backend/index';
import Swal from 'sweetalert2';
import './OrderManagement.css';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [trackingNumbers, setTrackingNumbers] = useState({});
    const [isEditing, setIsEditing] = useState(null); // State untuk melacak ID order yang sedang diedit

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('/order/dataall', {
                    headers: { 'Authorization': localStorage.getItem('Authorization') }
                });
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await axios.patch(`/order/data/${orderId}/status`, { status: newStatus }, {
                headers: { 'Authorization': localStorage.getItem('Authorization') }
            });
            Swal.fire('Success', 'Order status updated successfully', 'success');
            setOrders(orders.map(order => order.ID_Order === orderId ? { ...order, OrderStatus: newStatus } : order));
        } catch (error) {
            Swal.fire('Error', 'Failed to update order status', 'error');
        }
    };

    const handleTrackingNumberChange = async (orderId, value) => {
        setTrackingNumbers(prevState => ({ ...prevState, [orderId]: value }));
    };

    const saveTrackingNumber = async (orderId) => {
        const trackingNumber = trackingNumbers[orderId];
        try {
            await axios.patch(`/order/data/${orderId}/tracking`, { trackingNumber }, {
                headers: { 'Authorization': localStorage.getItem('Authorization') }
            });
            // Update tracking number pada state orders
            setOrders(orders.map(order =>
                order.ID_Order === orderId ? { ...order, TrackingNumber: trackingNumber } : order
            ));
            setIsEditing(null); // Kembali ke mode tampilan setelah menyimpan
            Swal.fire('Success', 'Tracking number updated successfully', 'success');
        } catch (error) {
            Swal.fire('Error', 'Failed to update tracking number', 'error');
            console.error('Error updating tracking number:', error);
        }
    };

    const handleEditClick = (orderId) => {
        setIsEditing(orderId);
    };

    const handleCancelEdit = () => {
        setIsEditing(null);
    };

    return (
        <div className="order-management">
            <h2>Order Management</h2>
            <table className="order-management-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Username</th>
                        <th>Total Price (Rp)</th>
                        <th>Status</th>
                        <th>Tracking Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.ID_Order}>
                            <td>{order.ID_Order}</td>
                            <td>{order.Username}</td>
                            <td>{parseFloat(order.TotalPrice).toLocaleString('id-ID')}</td>
                            <td>{order.OrderStatus}</td>
                            <td>
                                {isEditing === order.ID_Order ? (
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Enter Tracking Number"
                                            value={trackingNumbers[order.ID_Order] || order.TrackingNumber || ''}
                                            onChange={(e) => handleTrackingNumberChange(order.ID_Order, e.target.value)}
                                        />
                                        <button onClick={() => saveTrackingNumber(order.ID_Order)}>OK</button>
                                        <button onClick={handleCancelEdit}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        {order.TrackingNumber || 'N/A'}
                                        <button onClick={() => handleEditClick(order.ID_Order)}>Edit</button>
                                    </>
                                )}
                            </td>
                            <td>
                                <select
                                    onChange={(e) => handleUpdateStatus(order.ID_Order, e.target.value)}
                                    value={order.OrderStatus}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderManagement;
