import React, { useEffect, useState } from 'react';
import axios from '../../api/backend/index';
import './Reviews.css';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get('/review/reviewsall', {
                    headers: {
                        'Authorization': localStorage.getItem('Authorization'),
                        'Content-Type': 'application/json'
                    }
                });
                
                const sortedReviews = response.data.sort((a, b) => new Date(b.Created_At) - new Date(a.Created_At));
                
                // Take only the latest 5 reviews
                const latestReviews = sortedReviews.slice(0, 5);
                
                setReviews(latestReviews);
                console.log(latestReviews);
                
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
    }, []);

    return (
        <div className="reviews-container">
            <h2 className="reviews-title">Reviews</h2>
            <div className="reviews-grid">
                {reviews.map((review, index) => (
                    <div key={index} className="review-card">
                        <img
                            src={`http://localhost:8000/ARTM/images/user/${review.ProfilePicture}` || 'default-avatar.png'}
                            alt={`${review.Username}'s profile`}
                            className="review-avatar"
                        />
                        <h3 className="review-name">{review.Username || 'Anonim'}</h3>
                        <div className="review-rating">
                            {Array(review.Rating).fill().map((_, i) => (
                                <span key={i} className="star1">★</span>
                            ))}
                        </div>
                        <p className="review-text">{review.Review_Text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reviews;
