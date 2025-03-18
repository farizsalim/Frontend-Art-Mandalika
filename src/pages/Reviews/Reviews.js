import React, { useEffect, useState } from 'react';
import axios from '../../api/backend/index';
import './Reviews.css';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get('/review/reviewsall');
                const sortedReviews = response.data.sort((a, b) => 
                    new Date(b.Created_At) - new Date(a.Created_At)
                );
                setReviews(sortedReviews);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };
        fetchReviews();
    }, []);

    return (
        <div className='review-backlayer'>
            <div className="review-container">
                <h2 className="review-section-title">Artwork Reviews</h2>
                <div className={`review-grid ${reviews.length > 4 ? 'review-scrollable' : 'review-centered'}`}>
                {reviews.map((review) => (
                    <article key={review.ID_Review} className="review-card">
                    <div className="review-artwork-preview">
                        <div className="review-image-container">
                        <img
                            src={review.ArtworkImage}
                            alt={review.ArtworkTitle}
                            className="review-artwork-image"
                            onError={(e) => {
                            e.target.src = 'http://localhost:8000/ARTM/images/default-artwork.jpg';
                            }}
                        />
                        
                        <div className="review-details-overlay">
                            <div className="review-overlay-content">
                            <div className="review-detail-item">
                                <span className="review-detail-label">Artist</span>
                                <span className="review-detail-value">
                                {review.CreatorName || 'Unknown Artist'}
                                </span>
                            </div>
                            <div className="review-detail-item">
                                <span className="review-detail-label">Category</span>
                                <span className="review-detail-value">
                                {review.ArtworkCategory || 'General'}
                                </span>
                            </div>
                            </div>
                        </div>

                        <div className="review-title-overlay">
                            <h3>{review.ArtworkTitle}</h3>
                        </div>
                        </div>
                    </div>

                    <div className="review-content">
                        <div className="review-user-profile">
                        <img
                            src={`http://localhost:8000/ARTM/images/user/${review.ProfilePicture}`}
                            alt={review.Username}
                            className="review-user-avatar"
                            onError={(e) => {
                            e.target.src = 'http://localhost:8000/ARTM/images/default-avatar.png';
                            }}
                        />
                        <div className="review-user-info">
                            <h4 className="review-user-name">{review.Username}</h4>
                            <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                                <span 
                                key={i} 
                                className={`review-rating-star ${i < review.Rating ? 'review-active' : ''}`}
                                >
                                ★
                                </span>
                            ))}
                            </div>
                        </div>
                        </div>

                        <blockquote className="review-text">
                        "{review.Review_Text}"
                        </blockquote>

                        <div className="review-footer">
                        <time className="review-date">
                            {new Date(review.Created_At).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                            })}
                        </time>
                        <span className="review-artwork-type">
                            {review.ArtworkType === 'artwork' ? 'Original' : 'Custom'}
                        </span>
                        </div>
                    </div>
                    </article>
                ))}
                </div>
            </div>
            </div>
    );
};

export default Reviews;