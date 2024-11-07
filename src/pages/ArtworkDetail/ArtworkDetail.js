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
    const [sizes, setSizes] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [price, setPrice] = useState('');
    const [isZoomed, setIsZoomed] = useState(false);
    const [titleRequest, setTitleRequest] = useState('');
    const [customDescription, setCustomDescription] = useState('');

    useEffect(() => {
        const fetchArtworkDetail = async () => {
            try {
                // Fetch artwork data and increment view count
                const response = await axios.get(`/artwork/data/${id}`);
                const artworkData = response.data;
                setArtwork(artworkData);

                // Fetch sizes
                const sizeResponse = await axios.get(`/artwork/size/${id}`);
                setSizes(sizeResponse.data);

                // Fetch uploader and creator names
                if (artworkData.ID_Uploader && artworkData.ID_Creator) {
                    const uploaderResponse = await axios.get(`/auth/users/${artworkData.ID_Uploader}`);
                    setUploaderName(uploaderResponse.data.Username);

                    const creatorResponse = await axios.get(`/auth/users/${artworkData.ID_Creator}`);
                    setCreatorName(creatorResponse.data.Username);
                }

                // Increment view count
                await axios.patch(`/artwork/data/${id}/view`);
            } catch (error) {
                console.error('Error fetching artwork detail:', error);
            }
        };

        fetchArtworkDetail();
    }, [id]);

    const handleSizeChange = (event) => {
        const selectedId = event.target.value;
        const selected = sizes.find(size => size.ID_Size === parseInt(selectedId));
        setSelectedSize(selected);
        setPrice(selected ? selected.Price : '');
    };

    const handleImageClick = () => {
        setIsZoomed(true);
    };

    const handleCloseModal = () => {
        setIsZoomed(false);
    };

    const handleRequestArt = async () => {
        if (!selectedSize) {
            Swal.fire({
                icon: 'warning',
                title: 'Select a size',
                text: 'Please select a size before requesting.',
            });
            return;
        }

        try {
            const payload = {
                ID_Artwork: artwork.ID_Artwork,
                ID_Size: selectedSize.ID_Size,
                Title_Artrequest: titleRequest || artwork.Title_Artwork,
                Custom_Description: customDescription,
            };

            console.log('Payload:', payload);

            const response = await axios.post('/artrequestArtwork/request/artwork', payload, {
                headers: {
                    'Authorization': localStorage.getItem('Authorization'),
                    'Content-Type': 'application/json'
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Art request has been successfully created.',
            }).then(() => {
                const ID_ArtRequest = response.data.ID_ArtRequest;
                navigate(`/orders/${ID_ArtRequest}`);
            });
        } catch (error) {
            console.error('Error creating art request:', error);

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response && error.response.data ? error.response.data.message : 'Failed to create art request.',
            });
        }
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

                {sizes.length > 0 && (
                    <div className="select-size">
                        <label htmlFor="size-select">Choose a size:</label>
                        <select id="size-select" onChange={handleSizeChange} defaultValue="">
                            <option value="" disabled>Select a size</option>
                            {sizes.map(size => (
                                <option key={size.ID_Size} value={size.ID_Size}>
                                    {size.Width}cm x {size.Height}cm - {size.Weight}kg
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {selectedSize && (
                    <div className="price-display">
                        <p>Price: <strong>Rp {parseFloat(price).toLocaleString('id-ID')}</strong></p>
                    </div>
                )}

                <div className="art-request-inputs">
                    <label htmlFor="title-request">Custom Title (optional):</label>
                    <input
                        type="text"
                        id="title-request"
                        value={titleRequest}
                        onChange={(e) => setTitleRequest(e.target.value)}
                        placeholder="Enter custom title"
                    />

                    <label htmlFor="custom-description">Custom Description (optional):</label>
                    <textarea
                        id="custom-description"
                        value={customDescription}
                        onChange={(e) => setCustomDescription(e.target.value)}
                        placeholder="Enter custom description"
                    />
                </div>

                <button className="request-art-button" onClick={handleRequestArt}>Request This Art</button>
            </div>
        </div>
    );
};

export default ArtworkDetail;
