import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/backend/index';
import Swal from 'sweetalert2';
import './Payment.css';

const PaymentPage = () => {
    const { idOrder } = useParams();
    const navigate = useNavigate();
    const [paymentDetails, setPaymentDetails] = useState(null);

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const response = await axios.get(`/midtrans/payment/${idOrder}`, {
                    headers: {
                        'Authorization': localStorage.getItem('Authorization'),
                        'Content-Type': 'application/json'
                    }
                });
                setPaymentDetails(response.data.data);

                // Cek status pembayaran untuk mengaktifkan atau menonaktifkan event onbeforeunload
                if (response.data.data.PaymentStatus.toLowerCase() === 'pending') {
                    window.onbeforeunload = (e) => {
                        e.preventDefault();
                        e.returnValue = 'You have an ongoing payment. Are you sure you want to leave this page?';
                    };
                } else {
                    // Hapus event onbeforeunload jika status berubah
                    window.onbeforeunload = null;
                }
            } catch (error) {
                console.error('Error fetching payment details:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch payment details.',
                });
            }
        };

        // Fetch data awal dan perbarui setiap 10 detik
        fetchPaymentDetails();
        const interval = setInterval(fetchPaymentDetails, 10000);

        // Bersihkan interval dan event listener saat komponen di-unmount
        return () => {
            clearInterval(interval);
            window.onbeforeunload = null;
        };
    }, [idOrder]);

    useEffect(() => {
        if (paymentDetails && paymentDetails.PaymentStatus.toLowerCase() === 'completed') {
            Swal.fire({
                icon: 'success',
                title: 'Payment Completed',
                text: 'Your payment has been successfully completed!',
            }).then(() => {
                navigate('/myorder');
            });
        }
    }, [paymentDetails, navigate]);

    if (!paymentDetails) {
        return <div>Loading...</div>;
    }

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'orange';
            case 'completed':
                return 'green';
            case 'failed':
                return 'red';
            default:
                return 'black';
        }
    };

    return (
        <div className="payment-page-container mb-5">
            <h1 className="payment-page-title">Payment Details</h1>
            <div className="payment-card mt-5">
                <p><strong>Virtual Account Number:</strong> {paymentDetails.VANumber || 'N/A'}</p>
                <p><strong>Bank:</strong> {paymentDetails.Bank ? paymentDetails.Bank.toUpperCase() : 'N/A'}</p>
                <p style={{ color: getStatusColor(paymentDetails.PaymentStatus) }}>
                    <strong>Payment Status:</strong> {paymentDetails.PaymentStatus || 'N/A'}
                </p>
                <p><strong>Gross Amount:</strong> Rp {parseFloat(paymentDetails.GrossAmount).toLocaleString('id-ID')}</p>
                <p><strong>Expiry Time:</strong> {paymentDetails.ExpiryTime ? new Date(paymentDetails.ExpiryTime).toLocaleString() : 'N/A'}</p>
            </div>
        </div>
    );
};

export default PaymentPage;
