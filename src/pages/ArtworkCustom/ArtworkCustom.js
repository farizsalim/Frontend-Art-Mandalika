import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Mengimpor SweetAlert2
import "./Artworkcustom.css"; // Mengimpor file CSS

const ArtworkRequest = () => {
    const [formData, setFormData] = useState({
        Title_Artwork: '',
        Description: '',
        Category: '',
        Height: '',
        Width: '',
        Media: '',
        file: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            file: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        console.log("Data yang akan dikirim:", formDataToSend); // Log data yang akan dikirim

        try {
            const response = await axios.post('http://localhost:8000/ARTM/api/artworkcustom', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Menampilkan SweetAlert2 untuk sukses
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: response.data.message,
            });

            // Reset form setelah pengiriman berhasil
            setFormData({
                Title_Artwork: '',
                Description: '',
                Category: '',
                Height: '',
                Width: '',
                Media: '',
                file: null,
            });
        } catch (error) {
            console.error('Error creating artwork request:', error);

            // Menampilkan SweetAlert2 untuk kesalahan
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to create artwork request.',
            });
        }
    };

    return (
        <div>
            <h1>Artwork Request</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title Artwork:</label>
                    <input
                        type="text"
                        name="Title_Artwork"
                        value={formData.Title_Artwork}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="Description"
                        value={formData.Description}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Category:</label>
                    <input
                        type="text"
                        name="Category"
                        value={formData.Category}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Height (cm):</label>
                    <input
                        type="number"
                        name="Height"
                        value={formData.Height}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Width (cm):</label>
                    <input
                        type="number"
                        name="Width"
                        value={formData.Width}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Media:</label>
                    <input
                        type="text"
                        name="Media"
                        value={formData.Media}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Upload Image:</label>
                    <input
                        type="file"
                        name="file"
                        onChange={handleFileChange}
                        required
                    />
                </div>
                <button type="submit">Submit Request</button>
            </form>
        </div>
    );
};

export default ArtworkRequest;
