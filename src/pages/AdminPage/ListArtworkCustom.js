import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Mengimpor SweetAlert2
import './ListArtworkCustom.css'; // Mengimpor file CSS untuk styling

const ListArtworkCustom = () => {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(null); // State untuk melacak ID artwork yang sedang diedit
    const [updatedArtwork, setUpdatedArtwork] = useState({}); // State untuk menyimpan data yang akan diupdate

    useEffect(() => {
        const fetchArtworks = async () => {
            try {
                const response = await axios.get('http://localhost:8000/ARTM/api/artworkcustom', {
                    headers: {
                        'Authorization': localStorage.getItem('Authorization'),
                        'Content-Type': 'application/json',
                    },
                });
                setArtworks(response.data);
            } catch (err) {
                console.error('Error fetching artworks:', err);
                setError('Gagal memuat daftar artwork.');
            } finally {
                setLoading(false);
            }
        };

        fetchArtworks();
    }, []);

    const handleEditClick = (artwork) => {
        setIsEditing(artwork.ID_ArtworkCustom);
        setUpdatedArtwork({
            Status: artwork.Status,
            Price: artwork.Price,
            Weight: artwork.Weight,
        });
    };

    const handleUpdate = async (id) => {
        try {
            const response = await axios.put(`http://localhost:8000/ARTM/api/artworkcustom/${id}`, updatedArtwork, {
                headers: {
                    'Authorization': localStorage.getItem('Authorization'),
                    'Content-Type': 'application/json',
                },
            });

            Swal.fire('Success', response.data.message, 'success');
            setArtworks((prevArtworks) =>
                prevArtworks.map((artwork) =>
                    artwork.ID_ArtworkCustom === id ? { ...artwork, ...updatedArtwork } : artwork
                )
            );
            setIsEditing(null); // Reset editing state
        } catch (err) {
            console.error('Error updating artwork:', err);
            Swal.fire('Error', 'Gagal memperbarui artwork.', 'error');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="list-artwork-custom-container container mt-5">
            <h1 className="text-center mb-4">List Artwork Custom</h1>
            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID Artwork</th>
                            <th>Title Artwork</th>
                            <th>Status</th>
                            <th>Price</th>
                            <th>Weight</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {artworks.map((artwork) => (
                            <tr key={artwork.ID_ArtworkCustom}>
                                <td>{artwork.ID_ArtworkCustom}</td>
                                <td>{artwork.Title_Artwork}</td>
                                <td>
                                    {isEditing === artwork.ID_ArtworkCustom ? (
                                        <select
                                            value={updatedArtwork.Status}
                                            onChange={(e) => setUpdatedArtwork({ ...updatedArtwork, Status: e.target.value })}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    ) : (
                                        artwork.Status
                                    )}
                                </td>
                                <td>
                                    {isEditing === artwork.ID_ArtworkCustom ? (
                                        <input
                                            type="number"
                                            value={updatedArtwork.Price}
                                            onChange={(e) => setUpdatedArtwork({ ...updatedArtwork, Price: e.target.value })}
                                        />
                                    ) : (
                                        artwork.Price
                                    )}
                                </td>
                                <td>
                                    {isEditing === artwork.ID_ArtworkCustom ? (
                                        <input
                                            type="number"
                                            value={updatedArtwork.Weight}
                                            onChange={(e) => setUpdatedArtwork({ ...updatedArtwork, Weight: e.target.value })}
                                        />
                                    ) : (
                                        artwork.Weight
                                    )}
                                </td>
                                <td>
                                    {isEditing === artwork.ID_ArtworkCustom ? (
                                        <button
                                            className="btn btn-success"
                                            onClick={() => handleUpdate(artwork.ID_ArtworkCustom)}
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleEditClick(artwork)}
                                        >
                                            Edit
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListArtworkCustom;
