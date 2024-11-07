import React, { useEffect, useState } from 'react';
import axios from '../../api/backend/index'; // Sesuaikan path jika berbeda
import './FeaturedArtist.css';

const FeaturedArtists = () => {
    const [artists, setArtists] = useState([]);
    const [displayCount, setDisplayCount] = useState(4); // Jumlah awal yang ditampilkan

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await axios.get('/auth/artist'); // Sesuaikan endpoint dengan backend
                setArtists(response.data);
            } catch (error) {
                console.error('Error fetching artists:', error);
            }
        };

        fetchArtists();
    }, []);

    const loadMoreArtists = () => {
        setDisplayCount((prevCount) => prevCount + 4); // Tambahkan 4 item lagi setiap kali tombol "More" ditekan
    };

    const displayedArtists = artists.slice(0, displayCount);

    return (
        <div className="featured-artists-container">
            <h2 className="featured-title">Our Featured Artist</h2>
            <div className="artists-grid">
                {displayedArtists.map((artist, index) => (
                    <div key={index} className="artist-item">
                        <img 
                            src={`http://localhost:8000/ARTM/images/user/${artist.Photo}`} // Sesuaikan URL gambar
                            alt={artist.Username}
                            className="artist-image"
                        />
                        <div className="artist-name">{artist.Username}</div>
                    </div>
                ))}
            </div>
            {displayCount < artists.length && (
                <button className="load-more-button" onClick={loadMoreArtists}>
                    More
                </button>
            )}
        </div>
    );
};

export default FeaturedArtists;
