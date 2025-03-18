import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../../api/backend/index';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import "./ReviewModal.css";

const ReviewContext = createContext();

export const useReview = () => {
    return useContext(ReviewContext);
};

export const ReviewProvider = ({ children }) => {
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);

    const fetchOrders = async () => {
        try {
            console.log("Fetching orders...");
            const response = await axios.get('/order/data', {
                headers: {
                    'Authorization': localStorage.getItem('Authorization'),
                    'Content-Type': 'application/json'
                }
            });

            console.log("Order Response:", response.data);

            // Filter order yang sudah completed
            const completed = response.data.filter(order => order.OrderStatus === 'completed');
            setCompletedOrders(completed);

            console.log("Completed Orders:", completed);

            if (completed.length > 0) {
                // Cek apakah ID_Order sudah ada di tabel Reviews
                const reviewResponse = await axios.get('/review/reviews', {
                    headers: {
                        'Authorization': localStorage.getItem('Authorization'),
                        'Content-Type': 'application/json'
                    }
                });

                console.log("Review Response:", reviewResponse.data);

                const reviewedOrderIds = reviewResponse.data.map(review => review.ID_Order);
                console.log("Reviewed Order IDs:", reviewedOrderIds);

                // Cek order yang belum direview
                const newOrder = completed.find(order => !reviewedOrderIds.includes(order.ID_Order));

                if (newOrder) {
                    setSelectedOrder(newOrder); // Ambil order yang belum direview
                    setShowReviewModal(true); // Tampilkan modal jika ada order yang completed dan belum direview
                } else {
                    console.log("All completed orders have been reviewed.");
                }
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleReviewSubmit = async () => {
        try {
            const reviewPayload = {
                ID_Order: selectedOrder.ID_Order,
                Review_Text: reviewText,
                Rating: rating
            };

            await axios.post('/review/reviews', reviewPayload, {
                headers: {
                    'Authorization': localStorage.getItem('Authorization'),
                    'Content-Type': 'application/json'
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Review Submitted',
                text: 'Thank you for your feedback!',
                confirmButtonText: 'OK'
            });

            setShowReviewModal(false);
            setReviewText('');
            setRating(0);
            setCompletedOrders((prev) => prev.filter(order => order.ID_Order !== selectedOrder.ID_Order));
        } catch (error) {
            console.error('Error submitting review:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to submit review. Please try again.',
                confirmButtonText: 'OK'
            });
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 30000); // Update setiap 30 detik

        return () => clearInterval(interval); // Cleanup untuk menghindari memory leak
    }, []);

    return (
        <ReviewContext.Provider value={{ completedOrders }}>
            {children}
            {showReviewModal && (
                <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Review Order ID: {selectedOrder?.ID_Order}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="reviewText" className="mb-4">
                                <Form.Label>Write Your Review</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="Share your experience with this order..."
                                />
                            </Form.Group>
                            <Form.Group controlId="rating" className="mb-3">
                                <Form.Label>Rate the Product</Form.Label>
                                <div className="rating-stars">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <span
                                            key={num}
                                            className={`star ${num <= rating ? 'filled' : ''}`}
                                            onClick={() => setRating(num)}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleReviewSubmit}>
                            Submit Review
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </ReviewContext.Provider>
    );
};
