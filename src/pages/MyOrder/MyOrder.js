import React, { useEffect, useState } from 'react';
import axios from '../../api/backend/index';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MyOrder.css';

const MyOrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('/order/data', {
                    headers: {
                        'Authorization': localStorage.getItem('Authorization'),
                        'Content-Type': 'application/json',
                    },
                });

                // Sort by latest order
                const sortedOrders = response.data.sort((a, b) => 
                    new Date(b.CreatedAt) - new Date(a.CreatedAt)
                );
                setOrders(sortedOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
                Swal.fire('Error', 'Gagal memuat data order', 'error');
            }
        };

        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'text-warning';
            case 'completed': return 'text-success';
            case 'cancelled': 
            case 'cancel': return 'text-danger';
            case 'paid':
            case 'processing':
            case 'shipped': return 'text-primary';
            default: return 'text-dark';
        }
    };

    const handleConfirmOrderReceived = async (orderId) => {
        try {
            await axios.put(`/order/data/${orderId}/confirm`, {}, {
                headers: {
                    'Authorization': localStorage.getItem('Authorization'),
                },
            });

            // Update order status
            setOrders(prev => prev.map(order => 
                order.ID_Order === orderId ? {...order, OrderStatus: 'completed'} : order
            ));

            Swal.fire('Success', 'Order confirmed successfully', 'success');
        } catch (error) {
            Swal.fire('Error', 'Gagal mengonfirmasi order', 'error');
        }
    };

    const handleCancelOrder = async (orderId) => {
        const result = await Swal.fire({
            title: 'Cancel Order?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.patch(`/order/data/${orderId}/cancel`, {}, {
                    headers: {
                        'Authorization': localStorage.getItem('Authorization'),
                    },
                });

                // Update order status
                setOrders(prev => prev.map(order => 
                    order.ID_Order === orderId ? {...order, OrderStatus: 'cancelled'} : order
                ));

                Swal.fire('Cancelled!', 'Order has been cancelled.', 'success');
            } catch (error) {
                Swal.fire('Error!', 'Gagal membatalkan order', 'error');
            }
        }
    };

    // Pagination logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    return (
        <div className="container mt-5 myorder-container">
            <h1 className="mb-4 text-center">My Orders</h1>
            
            {orders.length === 0 ? (
                <div className="alert alert-info text-center">
                    No orders found
                </div>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th>Artwork</th>
                                    <th>Total Price</th>
                                    <th>Status</th>
                                    <th>Order Date</th>
                                    <th>Tracking</th>
                                    <th>Courier</th>
                                    <th>Service</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOrders.map((order) => (
                                    <tr key={order.ID_Order}>
                                        {/* FIXED: Menampilkan ArtworkTitle dari response */}
                                        <td>{order.ArtworkTitle}</td>
                                        <td>Rp {order.TotalPrice}</td>
                                        <td className={`fw-bold ${getStatusColor(order.OrderStatus)}`}>
                                            {order.OrderStatus}
                                        </td>
                                        <td>{new Date(order.CreatedAt).toLocaleDateString('id-ID')}</td>
                                        <td>{order.TrackingNumber || 'N/A'}</td>
                                        <td>{order.Courier || 'N/A'}</td>
                                        <td>{order.Service || 'N/A'}</td>
                                        <td>
                                            {order.OrderStatus.toLowerCase() === 'pending' && (
                                                <div className="d-flex gap-2">
                                                    <button 
                                                        className="btn btn-info btn-sm"
                                                        onClick={() => window.location.href = `/payment/${order.ID_Order}`}
                                                    >
                                                        View
                                                    </button>
                                                    <button 
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleCancelOrder(order.ID_Order)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}

                                            {order.OrderStatus.toLowerCase() === 'shipped' && (
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => handleConfirmOrderReceived(order.ID_Order)}
                                                >
                                                    Confirm Received
                                                </button>
                                            )}

                                            {['completed', 'cancelled'].includes(order.OrderStatus.toLowerCase()) && (
                                                <span className="badge bg-secondary">
                                                    {order.OrderStatus}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <nav className="mt-4">
                        <ul className="pagination justify-content-center">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <li 
                                    key={i + 1} 
                                    className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                                >
                                    <button 
                                        className="page-link" 
                                        onClick={() => setCurrentPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </>
            )}
        </div>
    );
};

export default MyOrderPage;