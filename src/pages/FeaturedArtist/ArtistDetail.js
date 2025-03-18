import React, { useEffect, useState } from 'react';      
import { useParams } from 'react-router-dom'; // Pastikan Anda menggunakan react-router-dom      
import axios from '../../api/backend/index'; // Sesuaikan path jika berbeda       
import './ArtistDetail.css'; // Pastikan untuk mengimpor CSS    
    
const ArtistDetail = () => {      
    const { id } = useParams(); // Mengambil ID dari URL    
    const [artist, setArtist] = useState(null);      
    const [loading, setLoading] = useState(true);      
  
    useEffect(() => {      
        const fetchArtistDetail = async () => {      
            try {      
                const response = await axios.get(`/artist/artist/${id}`); // Sesuaikan endpoint dengan backend    
                setArtist(response.data);      
            } catch (error) {      
                console.error('Error fetching artist detail:', error);      
            } finally {      
                setLoading(false);      
            }      
        };      
  
        fetchArtistDetail();      
    }, [id]);      
  
    if (loading) {      
        return <div>Loading...</div>;      
    }      
  
    if (!artist) {      
        return <div>Artist not found.</div>;      
    }      
  
    return (      
        <div className="artist-detail-container">      
            <h2>{artist.Artist_Name || artist.Username}</h2>      
            <img      
                src={`http://localhost:8000/ARTM/images/user/${artist.Photo}`} // Sesuaikan URL gambar      
                alt={artist.Username}      
                className="artist-detail-image"      
            />      
            <p className="artist-bio">{artist.Bio || "No bio available."}</p>      
            <p className="artist-email">Email: {artist.Email || "Not provided"}</p>      
            <p className="artist-phone">Phone: {artist.Phone_Number || "Not provided"}</p>      
            <h3>Artworks:</h3>      
            {artist.Artworks && artist.Artworks.length > 0 ? (    
                <div className="artworks-grid">    
                    {artist.Artworks.map((artwork) => (    
                        <div key={artwork.ID_Artwork} className="artwork-item">    
                            <img      
                                src={`http://localhost:8000/ARTM/images/uploads/artwork/${artwork.ArtworkImage}`} // Sesuaikan URL gambar      
                                alt={artwork.Title_Artwork}      
                                className="artwork-image"      
                            />    
                            <div className="artwork-title">{artwork.Title_Artwork}</div>    
                            <p className="artwork-status">{artwork.Status}</p>    
                        </div>    
                    ))}    
                </div>    
            ) : (    
                <p>Didn't Have Artwork</p> // Pesan jika tidak ada artwork    
            )}    
        </div>      
    );      
};      
  
export default ArtistDetail;      
