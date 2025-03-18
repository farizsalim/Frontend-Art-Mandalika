import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams dari react-router-dom
import "./NewsEventDetails.css";

const NewsEventDetails = () => {
    const { id } = useParams(); // Mengambil ID dari URL
    const [newsDetail, setNewsDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/ARTM/api/newsandevent/${id}`);
                setNewsDetail(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching news detail:', err);
                setError('Failed to fetch news detail.');
                setLoading(false);
            }
        };

        fetchNewsDetail();
    }, [id]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!newsDetail) {
        return <div>No news detail found.</div>;
    }

    return (
        <div className="news-event-details">
            <h1>{newsDetail.Title}</h1>
            <img src={`http://localhost:8000/ARTM/images/uploads/eventandnews/${newsDetail.Image}`} alt={newsDetail.Title} className="event-image" />
            
            {/* Menambahkan Event Date di bawah gambar */}
            {newsDetail.Event_Date ? (
                <span className="event-date">
                    <h2>Event Date: {new Date(newsDetail.Event_Date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</h2>
                </span>
            ) : null}

            <p>{newsDetail.Content}</p>
        </div>
    );
};

export default NewsEventDetails;
