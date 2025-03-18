import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link dari react-router-dom
import "./NewsList.css";

const NewsList = () => {
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleNewsCount, setVisibleNewsCount] = useState(3); // Tampilkan 4 berita awal

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get('http://localhost:8000/ARTM/api/newsandevent');
                setNewsData(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching news events:', err);
                setError('Failed to fetch news events.');
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const truncateContent = (content, wordLimit) => {
        const words = content.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...'; // Mengambil kata hingga batas dan menambahkan ellipsis
        }
        return content; // Mengembalikan konten asli jika tidak melebihi batas
    };

    const loadMoreNews = () => {
        setVisibleNewsCount(prevCount => prevCount + 3); // Tambah 3 item setiap kali tombol diklik
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className='Backlayers'>
            <div className="news-list">
                <h1 className="news-title">News and Event Update</h1> {/* Judul di tengah dengan warna oranye */}

                {/* Grid Berita */}
                <div className="news-grid">
                    {newsData.slice(0, visibleNewsCount).map(news => (
                        <Link key={news.ID_News_Event} to={`/news/${news.ID_News_Event}`} className="news-item">
                            <div className="image-container">
                                <img src={`http://localhost:8000/ARTM/images/uploads/eventandnews/${news.Image}`} alt={news.Title} className="background-image" />
                            </div>
                            <div className="news-content">
                                <h3>{news.Title}</h3>
                                {news.Event_Date && (
                                    <h4>Event Date: {new Date(news.Event_Date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</h4>
                                )}
                                <p className="news-description">{truncateContent(news.Content, 20)}</p>
                                <span>{new Date(news.created_at).toLocaleDateString()}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Tombol More */}
                {visibleNewsCount < newsData.length && (
                    <button className="more-button" onClick={loadMoreNews}>More</button>
                )}
            </div>
        </div>
    );
};

export default NewsList;
