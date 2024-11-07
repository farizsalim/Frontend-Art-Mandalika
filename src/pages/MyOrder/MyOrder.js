import React, { useEffect, useState } from 'react';
import axios from '../../api/backend/index';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MyOrder.css';

const MyOrderPage = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('/order/data', {
                    headers: {
                        'Authorization': localStorage.getItem('Authorization'),
                        'Content-Type': 'application/json'
                    }
                });

                // Enrich orders with artwork title and shipment tracking number
                const enrichedOrders = await Promise.all(response.data.map(async (order) => {
                    try {
                        // Fetch artwork title
                        const artRequestResponse = await axios.get(`/artrequestArtwork/request/artwork/${order.ID_ArtRequest}`, {
                            headers: {
                                'Authorization': localStorage.getItem('Authorization'),
                                'Content-Type': 'application/json'
                            }
                        });
                        const title = artRequestResponse.data.Title_Artrequest;

                        // Fetch shipment tracking number
                        let trackingNumber = 'N/A';
                        if (order.ID_Shipment) {
                            const shipmentResponse = await axios.get(`/shipment/data/${order.ID_Shipment}`, {
                                headers: {
                                    'Authorization': localStorage.getItem('Authorization'),
                                    'Content-Type': 'application/json'
                                }
                            });
                            trackingNumber = shipmentResponse.data.TrackingNumber || 'Tracking number not obtained.';
                        }

                        return { ...order, Title_Artwork: title, TrackingNumber: trackingNumber };
                    } catch (error) {
                        console.error(`Error fetching data for order ${order.ID_Order}:`, error);
                        return { ...order, Title_Artwork: 'N/A', TrackingNumber: 'N/A' };
                    }
                }));

                setOrders(enrichedOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'text-warning';
            case 'completed':
                return 'text-success';
            case 'cancelled':
                return 'text-danger';
            case 'paid':
            case 'processing':
            case 'shipped':
                return 'text-primary';
            case 'cancel':
                return 'text-danger';
            default:
                return 'text-dark';
        }
    };

    const handleConfirmOrderReceived = async (orderId) => {
        try {
            const response = await axios.put(`/order/data/${orderId}/confirm`, {}, {
                headers: {
                    'Authorization': localStorage.getItem('Authorization'),
                    'Content-Type': 'application/json'
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Order Confirmed',
                text: response.data.message,
                confirmButtonText: 'OK'
            });

            // Refresh orders after confirmation
            setOrders((prevOrders) => 
                prevOrders.map(order => 
                    order.ID_Order === orderId ? { ...order, OrderStatus: 'completed' } : order
                )
            );
        } catch (error) {
            console.error('Error confirming order:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to confirm order. Please try again.',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "Do you really want to cancel this order?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, cancel it!'
            });
    
            if (result.isConfirmed) {
                const response = await axios.patch(`/order/data/${orderId}/cancel`, {}, {
                    headers: {
                        'Authorization': localStorage.getItem('Authorization'),
                        'Content-Type': 'application/json'
                    }
                });
    
                Swal.fire({
                    icon: 'success',
                    title: 'Order Canceled',
                    text: response.data.message,
                    confirmButtonText: 'OK'
                });
    
                // Update orders to reflect cancellation
                setOrders((prevOrders) =>
                    prevOrders.map(order =>
                        order.ID_Order === orderId ? { ...order, OrderStatus: 'cancel' } : order
                    )
                );
            }
        } catch (error) {
            console.error('Error canceling order:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to cancel order. Please try again.',
                confirmButtonText: 'OK'
            });
        }
    };
    

    return (
        <div className="myorder-page-container container mt-5">
            <h1 className="myorder-page-title mb-4">My Orders</h1>
            {orders.length === 0 ? (
                <div className="alert alert-info" role="alert">
                    No orders found.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th>Artwork Title</th>
                                <th>Total Price</th>
                                <th>Status</th>
                                <th>Order Date</th>
                                <th>Tracking Number</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders
                                .sort((a, b) => {
                                    // Tempatkan "completed" di bagian bawah
                                    if (a.OrderStatus.toLowerCase() === 'completed') return 1;
                                    if (b.OrderStatus.toLowerCase() === 'completed') return -1;
                                    return 0;
                                })
                                .map((order) => (
                                    <tr key={order.ID_Order}>
                                        <td>{order.Title_Artwork}</td>
                                        <td>Rp {parseFloat(order.TotalPrice).toLocaleString('id-ID')}</td>
                                        <td className={getStatusColor(order.OrderStatus)}>{order.OrderStatus}</td>
                                        <td>{new Date(order.CreatedAt).toLocaleDateString('id-ID')}</td>
                                        <td>{order.TrackingNumber}</td>
                                        <td>
                                            {order.OrderStatus.toLowerCase() === 'pending' ? (
                                                <>
                                                    <button
                                                        className="btn btn-info btn-sm"
                                                        onClick={() => handleViewOrder(order.ID_Order)}
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm ml-2"
                                                        onClick={() => handleCancelOrder(order.ID_Order)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : order.OrderStatus.toLowerCase() === 'completed' ? (
                                                <span className="text-success">Completed</span>
                                            ) : order.OrderStatus.toLowerCase() === 'shipped' ? (
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => handleConfirmOrderReceived(order.ID_Order)}
                                                >
                                                    Confirm Received
                                                </button>
                                            ) : order.OrderStatus.toLowerCase() === 'cancelled' ?(
                                                <span className="text-danger">cancelled</span>
                                            ) : (
                                                <span className="text-primary">The artwork is in progress.</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const handleViewOrder = (orderId) => {
    window.location.href = `/payment/${orderId}`;
};

export default MyOrderPage;
