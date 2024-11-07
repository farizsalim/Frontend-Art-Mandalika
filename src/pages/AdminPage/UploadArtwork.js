import React, { useEffect, useState } from 'react';
import axios from '../../api/backend/index';
import Swal from 'sweetalert2';
import './UploadArtwork.css';

const ArtworkUpload = () => {
    const [title, setTitle] = useState('');
    const [idCreator, setIdCreator] = useState('');
    const [creators, setCreators] = useState([]);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState('');
    const [sizes, setSizes] = useState([{ width: '', height: '', price: '', weight: '' }]);
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const fetchCreators = async () => {
            try {
                const response = await axios.get('/auth/users', {
                    headers: { 'Authorization': localStorage.getItem('Authorization') }
                });
                const artistCreators = response.data.filter(user => user.User_Type === 'Artist');
                setCreators(artistCreators);
            } catch (error) {
                console.error('Error fetching creators:', error);
            }
        };

        fetchCreators();
    }, []);

    const handleSizeChange = (index, field, value) => {
        const updatedSizes = [...sizes];
        updatedSizes[index][field] = value;
        setSizes(updatedSizes);
    };

    const handleAddSize = () => {
        setSizes([...sizes, { width: '', height: '', price: '', weight: '' }]);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };

    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('id_creator', idCreator);
            formData.append('description', description);
            formData.append('category', category);
            formData.append('stock', stock);
            formData.append('image', image); 
            formData.append('sizes', JSON.stringify(sizes)); 
    
            // Tambahkan `await` sebelum `axios.post` untuk menunggu respons selesai
            const response = await axios.post('/artwork/data/admin', formData, {
                headers: {
                    'Authorization': localStorage.getItem('Authorization'),
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            // Jika upload berhasil, munculkan alert sukses
            Swal.fire('Success', 'Artwork uploaded successfully', 'success');
            
            // Reset form fields
            setTitle('');
            setIdCreator('');
            setDescription('');
            setCategory('');
            setStock('');
            setImage(null);
            setPreviewImage(null);
            setSizes([{ width: '', height: '', price: '', weight: '' }]);
            
        } catch (error) {
            // Jika terjadi error, munculkan alert error
            Swal.fire('Error', 'Failed to upload artwork', 'error');
            console.error('Error uploading artwork:', error);
        }
    };
    
    
    

    return (
        <div className="artwork-upload-container">
            <h2>Upload Artwork</h2>
            <div className="artwork-upload-group">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="artwork-upload-input"
                />
            </div>
            <div className="artwork-upload-group">
                <label>Creator:</label>
                <select
                    value={idCreator}
                    onChange={(e) => setIdCreator(e.target.value)}
                    className="artwork-upload-select"
                >
                    <option value="">Select Creator</option>
                    {creators.map((creator) => (
                        <option key={creator.ID_User} value={creator.ID_User}>
                            {creator.Username} ({creator.Artist_Name || 'No Artist Name'})
                        </option>
                    ))}
                </select>
            </div>
            <div className="artwork-upload-group">
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="artwork-upload-textarea"
                ></textarea>
            </div>
            <div className="artwork-upload-group">
                <label>Category:</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="artwork-upload-select"
                >
                    <option value="">Select Category</option>
                    <option value="Animal">Animal</option>
                    <option value="Landscape">Landscape</option>
                    <option value="Abstract">Abstract</option>
                    <option value="Realism">Realism</option>
                </select>
            </div>
            <div className="artwork-upload-group">
                <label>Stock:</label>
                <select
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="artwork-upload-select"
                >
                    <option value="">Select Stock</option>
                    <option value="Available">Available</option>
                    <option value="Not Available">Not Available</option>
                </select>
            </div>
            <div className="artwork-upload-group">
                <label>Upload Image:</label>
                <input type="file" onChange={handleImageChange} className="artwork-upload-file-input" />
                {previewImage && (
                    <div className="artwork-upload-image-preview">
                        <img src={previewImage} alt="Preview" className="artwork-upload-preview-img" />
                    </div>
                )}
            </div>
            <h4>Sizes</h4>
            {sizes.map((size, index) => (
                <div key={index} className="artwork-upload-size-inputs">
                    <input
                        type="number"
                        placeholder="Width"
                        value={size.width}
                        onChange={(e) => handleSizeChange(index, 'width', e.target.value)}
                        className="artwork-upload-size-input"
                    />
                    <input
                        type="number"
                        placeholder="Height"
                        value={size.height}
                        onChange={(e) => handleSizeChange(index, 'height', e.target.value)}
                        className="artwork-upload-size-input"
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={size.price}
                        onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                        className="artwork-upload-size-input"
                    />
                    <input
                        type="number"
                        placeholder="Weight"
                        value={size.weight}
                        onChange={(e) => handleSizeChange(index, 'weight', e.target.value)}
                        className="artwork-upload-size-input"
                    />
                </div>
            ))}
            <button onClick={handleAddSize} className="artwork-upload-add-size-btn">Add Size</button>
            <button onClick={handleUpload} className="artwork-upload-submit-btn">Upload</button>
        </div>
    );
};

export default ArtworkUpload;
