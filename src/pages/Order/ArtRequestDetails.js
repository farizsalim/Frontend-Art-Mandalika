import React from 'react';
import './ArtRequestDetails.css';

const ArtRequestDetails = ({ artwork, size, artRequest }) => {
    return (
        <div className="order-card">
            <h3>Art Request</h3>
            <p><strong>Artwork:</strong> {artwork.Title_Artwork}</p>
            <p><strong>Size:</strong> {size.Width}cm x {size.Height}cm</p>
            <p><strong>Price:</strong> Rp {parseFloat(artRequest.Price).toLocaleString('id-ID')}</p>
            <p><strong>Description:</strong> {artRequest.Custom_Description || 'N/A'}</p>
        </div>
    );
};

export default ArtRequestDetails;
