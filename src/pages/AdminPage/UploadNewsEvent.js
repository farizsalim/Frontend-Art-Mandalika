// UploadNewsEvent.js
import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Impor SweetAlert2
import './UploadNewsEvent.css'; // Pastikan Anda membuat file CSS untuk styling

const UploadNewsEvent = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [eventDate, setEventDate] = useState('');
    const [isEventDateNull, setIsEventDateNull] = useState(false); // State untuk checkbox
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('image', image);
        formData.append('eventDate', isEventDateNull ? null : eventDate); // Mengatur eventDate menjadi null jika checkbox dicentang

        try {
            const response = await axios.post('http://localhost:8000/ARTM/api/newsandevent', formData, {
                headers: {  
                    Authorization: localStorage.getItem('Authorization'),  
                    'Content-Type': 'multipart/form-data',  
                },  
            });
            // Menampilkan notifikasi sukses menggunakan SweetAlert2
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'News/Event uploaded successfully!',
                confirmButtonText: 'OK'
            });
            setTitle('');
            setContent('');
            setImage(null);
            setEventDate('');
            setIsEventDateNull(false); // Reset checkbox
        } catch (err) {
            console.error('Error uploading news event:', err);
            // Menampilkan notifikasi error menggunakan SweetAlert2
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to upload news event.',
                confirmButtonText: 'Try Again'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-news-event">
            <h2>Upload News/Event</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Content:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Event Date:</label>
                    <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => {
                            setEventDate(e.target.value);
                            setIsEventDateNull(false); // Reset checkbox jika tanggal diisi
                        }}
                    />
                    <div>
                        <input
                            type="checkbox"
                            checked={isEventDateNull}
                            onChange={(e) => {
                                setIsEventDateNull(e.target.checked);
                                if (e.target.checked) {
                                    setEventDate(''); // Kosongkan input tanggal jika checkbox dicentang
                                }
                            }}
                        />
                        <label>Set Event Date to NULL</label>
                    </div>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload'}
                </button>
            </form>
        </div>
    );
};

export default UploadNewsEvent;
