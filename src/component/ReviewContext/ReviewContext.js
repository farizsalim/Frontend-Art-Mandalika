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
    const [pendingReviews, setPendingReviews] = useState([]);
    const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [artRequestName, setArtRequestName] = useState('');

    const fetchPendingReviews = async () => {
        try {
            const response = await axios.get('/review/pending-reviews', {
                headers: {
                    'Authorization': localStorage.getItem('Authorization'),
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.data.length > 0) {
                const enrichedReviews = await Promise.all(
                    response.data.map(async (order) => {
                        const artRequestResponse = await axios.get(`/artrequestArtwork/request/by-order/${order.ID_Order}`, {
                            headers: {
                                'Authorization': localStorage.getItem('Authorization'),
                                'Content-Type': 'application/json'
                            }
                        });
                        return { ...order, ArtRequestName: artRequestResponse.data.Title_Artrequest };
                    })
                );
    
                setPendingReviews(enrichedReviews);
                setSelectedOrderForReview(enrichedReviews[0].ID_Order);
                setArtRequestName(enrichedReviews[0].ArtRequestName);
                
                // Hanya tampilkan modal jika ada pending reviews baru
                if (!showReviewModal) {
                    setShowReviewModal(true);
                }
            }
        } catch (error) {
            console.error('Error fetching pending reviews:', error);
        }
    };
    

    useEffect(() => {
        fetchPendingReviews();
        const interval = setInterval(fetchPendingReviews, 30000); // Update setiap 30 detik

        return () => clearInterval(interval); // Cleanup untuk menghindari memory leak
    }, []);

    const handleReviewSubmit = async () => {
        try {
            const reviewPayload = {
                ID_Order: selectedOrderForReview,
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
            setPendingReviews((prev) => prev.filter((review) => review.ID_Order !== selectedOrderForReview));
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

    return (
        <ReviewContext.Provider value={{ pendingReviews, setShowReviewModal }}>
            {children}
            {showReviewModal && (
                <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered>
                    <Modal.Header closeButton className="review-modal-header">
                        <Modal.Title className="review-modal-title">
                            Review for "<strong>{artRequestName}</strong>"
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="review-modal-body">
                        <Form>
                            <Form.Group controlId="reviewText" className="mb-4">
                                <Form.Label>Write Your Review</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="Share your experience with this product..."
                                    className="review-textarea"
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
                    <Modal.Footer className="review-modal-footer">
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
