import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/backend/index';
import './ArtworkShowcase.css';
import Step from '../../component/StepByStep/StepBystep';

const categories = ['Newest', 'Animal', 'Landscape', 'Abstract', 'Realism'];

const ArtworkShowcase = () => {
    const [artworks, setArtworks] = useState([]);
    const [displayCount, setDisplayCount] = useState(8); // Awalnya tampilkan 8 item
    const [selectedCategory, setSelectedCategory] = useState('newest');

    useEffect(() => {
        const fetchArtworks = async () => {
            try {
                const response = await axios.get('/artwork/data'); // Sesuaikan endpoint Anda
                setArtworks(response.data);
            } catch (error) {
                console.error('Error fetching artworks:', error);
            }
        };

        fetchArtworks();
    }, []);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category.toLowerCase());
        setDisplayCount(8); // Reset tampilan awal ketika kategori berubah
    };

    const filteredArtworks = artworks.filter((artwork) => {
        if (selectedCategory === 'newest') {
            return true; // Akan disortir di render
        }
        return artwork.Category.toLowerCase() === selectedCategory;
    });

    const sortedArtworks = selectedCategory === 'newest' 
        ? filteredArtworks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        : filteredArtworks;

    // Batas tampilan item untuk lazy loading
    const displayedArtworks = sortedArtworks.slice(0, displayCount);

    const loadMoreArtworks = () => {
        setDisplayCount((prevCount) => Math.min(prevCount + 8, sortedArtworks.length)); // Tambah 8 item setiap klik, dibatasi dengan panjang array
    };

    return (
        <div>
            <div className="artwork-showcase-container container-md">
                <h2 className="showcase-title">Artwork Showcase</h2>
                <div className="category-buttons">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`category-button ${selectedCategory === category.toLowerCase() ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                <div className="artwork-grid">
                    {displayedArtworks.map((artwork) => (
                        <Link key={artwork.ID_Artwork} to={`/artwork/${artwork.ID_Artwork}`}>
                            <div className="artwork-item">
                                <img 
                                    src={`http://localhost:8000/ARTM/images/uploads/artwork/${artwork.ArtworkImage}`} 
                                    alt={`Artwork ${artwork.ID_Artwork}`} 
                                    loading="lazy" // Lazy loading pada gambar
                                />
                                <div className="artwork-overlay">
                                    <h3>{artwork.Title_Artwork}</h3>
                                    <p>{artwork.Description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                {displayCount < sortedArtworks.length && (
                    <button className="load-more-button" onClick={loadMoreArtworks}>
                        More
                    </button>
                )}
            </div>
            <Step />
        </div>
    );
};

export default ArtworkShowcase;
