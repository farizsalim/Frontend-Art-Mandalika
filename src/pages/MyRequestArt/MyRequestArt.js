import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './MyRequestArt.css';

const MyRequestArt = () => {
    const [requests, setRequests] = useState([]);
    const [orderedIds, setOrderedIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch data requests dan order status
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ambil data artwork custom user
                const requestsResponse = await axios.get(
                    'http://localhost:8000/ARTM/api/artworkcustom/user',
                    {
                        headers: {
                            Authorization: localStorage.getItem('Authorization'),
                            'Content-Type': 'application/json',
                        },
                    }
                );
                setRequests(requestsResponse.data);

                // Ambil data order untuk cek status
                const ordersResponse = await axios.get(
                    'http://localhost:8000/ARTM/api/order/data',
                    {
                        headers: {
                            Authorization: localStorage.getItem('Authorization'),
                            'Content-Type': 'application/json',
                        },
                    }
                );

                // Ekstrak ID_ArtworkCustom dari order yang bertipe artworkcustom
                const customOrderIds = ordersResponse.data.reduce((acc, order) => {
                    if (order.Type === 'artworkcustom' && order.ID_ArtworkCustom) {
                        acc.add(order.ID_ArtworkCustom.toString());
                    }
                    return acc;
                }, new Set());

                setOrderedIds(customOrderIds);

            } catch (err) {
                handleError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleError = (err) => {
        let errorMessage = 'Failed to load data';
        if (err.response) {
            errorMessage = err.response.data.message || errorMessage;
        } else if (err.request) {
            errorMessage = 'No response from server';
        } else {
            errorMessage = err.message;
        }
        setError(errorMessage);
        Swal.fire('Error', errorMessage, 'error');
    };

    const handleOrder = (request) => {
        navigate('/order-artwork-custom', {
            state: { artwork: request },
        });
    };

    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger text-center">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container my-4">
            <h1 className="text-center mb-4">My Art Requests</h1>
            
            <div className="table-responsive">
                <table className="table table-hover table-bordered align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Request ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Dimensions (cm)</th>
                            <th>Weight (kg)</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Last Updated</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {requests.length > 0 ? (
                            requests.map((request) => {
                                const isOrdered = orderedIds.has(request.ID_ArtworkCustom.toString());
                                
                                return (
                                    <tr key={`${request.ID_ArtworkCustom}-${request.ID_Detail}`}>
                                        <td>{request.ID_Detail}</td>
                                        <td>{request.Title_artwork}</td>
                                        <td className="text-truncate" style={{ maxWidth: '200px' }}>
                                            {request.Description}
                                        </td>
                                        <td>{request.Category}</td>
                                        <td>
                                            {request.Height || 'N/A'} x {request.Width || 'N/A'}
                                        </td>
                                        <td>{request.Weight || 'N/A'}</td>
                                        <td>
                                            {request.Price ? 
                                                `Rp${request.Price.toLocaleString('id-ID')}` : 
                                                'N/A'}
                                        </td>
                                        <td>
                                            <span 
                                                className={`badge ${
                                                    request.Status === 'accepted' ? 'bg-success' :
                                                    request.Status === 'pending' ? 'bg-warning' :
                                                    'bg-danger'
                                                }`}
                                            >
                                                {request.Status}
                                            </span>
                                        </td>
                                        <td>{formatDate(request.Updated_At)}</td>
                                        <td>
                                            {request.Status === 'accepted' && (
                                                isOrdered ? (
                                                    <span className="text-success">
                                                        <i className="bi bi-check-circle me-2"></i>
                                                        Ordered
                                                    </span>
                                                ) : (
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => handleOrder(request)}
                                                    >
                                                        <i className="bi bi-cart-check me-2"></i>
                                                        Order
                                                    </button>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="10" className="text-center py-4">
                                    <div className="text-muted">
                                        <i className="bi bi-inbox fs-1"></i>
                                        <p className="mt-2">No artwork requests found</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyRequestArt;