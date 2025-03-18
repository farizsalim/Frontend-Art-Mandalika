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
    const [status, setStatus] = useState(''); // Ganti stock menjadi status  
    const [sizes, setSizes] = useState([{ width: '', height: '', price: '', weight: '', media: '' }]);  
    const [image, setImage] = useState(null);  
    const [previewImage, setPreviewImage] = useState(null);  
  
    // Fetch creator data on component mount  
    useEffect(() => {  
        const fetchCreators = async () => {  
            try {  
                const response = await axios.get('/auth/users', {  
                    headers: { Authorization: localStorage.getItem('Authorization') },  
                });  
                const artistCreators = response.data.filter((user) => user.User_Type === 'Artist');  
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
        // Validasi input  
        if (!title || !idCreator || !status || !category || !image) {  
            Swal.fire('Error', 'Please fill in all required fields.', 'error');  
            return;  
        }  
      
        try {  
            const formData = new FormData();  
            formData.append('title', title);  
            formData.append('id_creator', idCreator);  
            formData.append('description', description);  
            formData.append('category', category);  
            formData.append('status', status); // Ganti stock menjadi status  
            formData.append('image', image);  
      
            // Tambahkan details sebagai array ke FormData  
            sizes.forEach((size, index) => {  
                Object.keys(size).forEach((key) => {  
                    formData.append(`details[${index}][${key}]`, size[key]);  
                });  
            });  
      
            const response = await axios.post('/artwork/data/admin', formData, {  
                headers: {  
                    Authorization: localStorage.getItem('Authorization'),  
                    'Content-Type': 'multipart/form-data',  
                },  
            });  
      
            // Alert sukses  
            Swal.fire('Success', 'Artwork uploaded successfully', 'success');  
      
            // Reset form fields  
            setTitle('');  
            setIdCreator('');  
            setDescription('');  
            setCategory('');  
            setStatus('');  
            setImage(null);  
            setPreviewImage(null);  
            setSizes([{ width: '', height: '', price: '', weight: '', media: '' }]);  
        } catch (error) {  
            // Alert error  
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
                <label>Status:</label>  
                <select  
                    value={status}  
                    onChange={(e) => setStatus(e.target.value)}  
                    className="artwork-upload-select"  
                >  
                    <option value="">Select Status</option>  
                    <option value="Available">Available</option>  
                    <option value="Sold">Sold</option>  
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
                        placeholder="Width (cm)"  
                        value={size.width}  
                        onChange={(e) => handleSizeChange(index, 'width', e.target.value)}  
                        className="artwork-upload-size-input"  
                    />  
                    <input  
                        type="number"  
                        placeholder="Height (cm)"  
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
                    <input  
                        type="text"  
                        placeholder="Media"  
                        value={size.media}  
                        onChange={(e) => handleSizeChange(index, 'media', e.target.value)}  
                        className="artwork-upload-size-input"  
                    />  
                </div>  
            ))}  
            <button onClick={handleUpload} className="artwork-upload-submit-btn">  
                Upload  
            </button>  
        </div>  
    );  
};  
  
export default ArtworkUpload;  
