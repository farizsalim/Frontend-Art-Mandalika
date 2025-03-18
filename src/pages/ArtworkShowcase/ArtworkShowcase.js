import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/backend/index';
import './ArtworkShowcase.css';
import Step from '../../component/StepByStep/StepBystep';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const categories = ['Newest', 'Animal', 'Landscape', 'Abstract', 'Realism'];

// Komponen untuk setiap item artwork
const ArtworkItem = React.memo(({ artwork }) => (
    <div className={`artwork-item ${artwork.Status !== 'available' ? 'sold' : ''}`}>
        <Link to={artwork.Status === 'available' ? `/artwork/${artwork.ID_Artwork}` : '#'}>
            <LazyLoadImage
                src={`http://localhost:8000/ARTM/images/uploads/artwork/${artwork.ArtworkImage}`}
                alt={`Artwork ${artwork.ID_Artwork}`}
                effect="blur"
                placeholderSrc="https://via.placeholder.com/300x200"
                width={300}
                height={200}
            />
            <div className="artwork-overlay">
                <h3>{artwork.Title_Artwork}</h3>
                <p>{artwork.Description}</p>
                {artwork.Status !== 'available' && <p className="sold-label">Sold</p>}
            </div>
        </Link>
    </div>
));

const ArtworkShowcase = () => {
    const [artworks, setArtworks] = useState([]);
    const [displayCount, setDisplayCount] = useState(8);
    const [selectedCategory, setSelectedCategory] = useState('newest');
    const [selectedStatus, setSelectedStatus] = useState('available');
    const [isLoading, setIsLoading] = useState(true);

    // Fetch artworks data
    useEffect(() => {
        const fetchArtworks = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('/artwork/data');
                setArtworks(response.data);
            } catch (error) {
                console.error('Error fetching artworks:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchArtworks();
    }, []);

    // Filtered and sorted artworks (memoized for performance)
    const sortedArtworks = useMemo(() => {
        return artworks.filter((artwork) => {
            const isCategoryMatch = selectedCategory === 'newest' || artwork.Category.toLowerCase() === selectedCategory;
            const isStatusMatch = selectedStatus === 'available' ? artwork.Status === 'available' : artwork.Status !== 'available';
            return isCategoryMatch && isStatusMatch;
        }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort berdasarkan tanggal
    }, [artworks, selectedCategory, selectedStatus]);

    // Artworks to display
    const displayedArtworks = useMemo(
        () => sortedArtworks.slice(0, displayCount),
        [sortedArtworks, displayCount]
    );

    // Load more handler
    const loadMoreArtworks = () => {
        setDisplayCount((prevCount) => Math.min(prevCount + 8, sortedArtworks.length));
    };

    return (
        <div>
            <div className="artwork-showcase-container container-md">
                <h2 className="showcase-title">Artwork Showcase</h2>

                {/* Status Filter Dropdown */}
                <div className="status-filter">
                    <label htmlFor="status">Filter by Status:</label>
                    <select
                        id="status"
                        value={selectedStatus}
                        onChange={(e) => {
                            setSelectedStatus(e.target.value);
                            setDisplayCount(8); // Reset display count
                        }}
                    >
                        <option value="available">Available</option>
                        <option value="sold">Sold</option>
                    </select>
                </div>

                {/* Category Buttons */}
                <div className="category-buttons">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`category-button ${
                                selectedCategory === category.toLowerCase() ? 'active' : ''
                            }`}
                            onClick={() => {
                                setSelectedCategory(category.toLowerCase());
                                setDisplayCount(8); // Reset display count
                            }}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Artwork Grid */}
                {isLoading ? (
                    <div className="loading">Loading artworks...</div>
                ) : (
                    <div className="artwork-grid">
                        {displayedArtworks.map((artwork) => (
                            <ArtworkItem key={artwork.ID_Artwork} artwork={artwork} />
                        ))}
                    </div>
                )}

                {/* Load More Button */}
                {displayCount < sortedArtworks.length && (
                    <button className="load-more-button" onClick={loadMoreArtworks}>
                        More
                    </button>
                )}
            </div>
        </div>
    );
};

export default ArtworkShowcase;
