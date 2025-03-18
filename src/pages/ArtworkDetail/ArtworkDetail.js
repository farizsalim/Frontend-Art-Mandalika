import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/backend/index';
import Swal from 'sweetalert2';
import './ArtworkDetail.css';

const ArtworkDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [artwork, setArtwork] = useState(null);
    const [uploaderName, setUploaderName] = useState('');   
    const [creatorName, setCreatorName] = useState('');
    const [artworkDetails, setArtworkDetails] = useState([]);
    const [selectedArtworkDetail, setSelectedArtworkDetail] = useState(null);
    const [price, setPrice] = useState('');
    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        const fetchArtworkDetail = async () => {
            try {
                const response = await axios.get(`/artwork/data/${id}`);
                const artworkData = response.data;
                setArtwork(artworkData);

                const detailsResponse = await axios.get(`/artwork/details/${id}`);
                setArtworkDetails(detailsResponse.data);

                if (artworkData.ID_Uploader && artworkData.ID_Creator) {
                    const uploaderResponse = await axios.get(`/auth/users/${artworkData.ID_Uploader}`);
                    setUploaderName(uploaderResponse.data.Username);

                    const creatorResponse = await axios.get(`/auth/users/${artworkData.ID_Creator}`);
                    setCreatorName(creatorResponse.data.Username);
                }

                await axios.patch(`/artwork/data/${id}/view`);
            } catch (error) {
                console.error('Error fetching artwork detail:', error);
            }
        };

        fetchArtworkDetail();
    }, [id]);

    const handleArtworkDetailChange = (event) => {
        const selectedId = event.target.value;
        const selected = artworkDetails.find(detail => detail.ID_Detail === parseInt(selectedId));
        setSelectedArtworkDetail(selected);
        setPrice(selected ? selected.Price : '');
    };

    const handleImageClick = () => {
        setIsZoomed(true);
    };

    const handleCloseModal = () => {
        setIsZoomed(false);
    };

    const handleOrder = () => {
        if (!selectedArtworkDetail) {
            Swal.fire({
                icon: 'warning',
                title: 'Select a detail',
                text: 'Please select a detail before proceeding to order.',
            });
            return;
        }
    
        // Log data yang akan dikirim
        console.log('Navigating to Order Page with data:', {
            artwork,
            artworkDetail: selectedArtworkDetail,
        });
    
        navigate('/order', {
            state: {
                artwork,
                artworkDetail: selectedArtworkDetail,
            },
        });
    };

    if (!artwork) {
        return <div>Loading...</div>;
    }

    return (
        <div className="artwork-detail-container container-md">
            <div className="artwork-image-container">
                <img 
                    src={`http://localhost:8000/ARTM/images/uploads/artwork/${artwork.ArtworkImage}`} 
                    alt={`Artwork ${artwork.Title_Artwork}`} 
                    className="artwork-detail-image"
                    onClick={handleImageClick}
                />
                <p className="click-to-zoom">Click to zoom the picture</p>
            </div>

            {isZoomed && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content">
                        <img 
                            src={`http://localhost:8000/ARTM/images/uploads/artwork/${artwork.ArtworkImage}`} 
                            alt={`Artwork ${artwork.Title_Artwork}`} 
                            className="zoomed-image"
                        />
                    </div>
                </div>
            )}

            <div className="artwork-info">
                <h1 className="artwork-title">{artwork.Title_Artwork}</h1>
                <button className="artwork-category">
                    {artwork.Category}
                </button>
                <p className="artwork-uploader">Description :</p>
                <p className="artwork-description">{artwork.Description}</p>
                <p className="artwork-uploader">Uploaded by: <span>{uploaderName}</span></p>
                <p className="artwork-creator">Created by: <span>{creatorName}</span></p>
                <p className="artwork-date">Created at: <span>{new Date(artwork.created_at).toLocaleDateString()}</span></p>
                <p className="artwork-views">Views: <span>{artwork.ViewCount}</span></p>

                {artworkDetails.length > 0 && (
                    <div className="select-artwork-detail">
                        <label htmlFor="artwork-detail-select">Choose a Detail:</label>
                        <select id="artwork-detail-select" onChange={handleArtworkDetailChange} defaultValue="">
                            <option value="" disabled>Select a Detail</option>
                            {artworkDetails.map(detail => (
                                <option key={detail.ID_Detail} value={detail.ID_Detail}>
                                    {detail.Width}cm x {detail.Height}cm - {detail.Weight}kg &nbsp;&nbsp; Media: {detail.Media}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {selectedArtworkDetail && (
                    <div className="price-display">
                        <p>Price: <strong>Rp {parseFloat(price).toLocaleString('id-ID')}</strong></p>
                    </div>
                )}

                <button className="order-button" onClick={handleOrder}>
                    Go to Order
                </button>
            </div>
        </div>
    );
};

export default ArtworkDetail;
