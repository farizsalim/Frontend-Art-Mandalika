import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/backend/index';
import Swal from 'sweetalert2';
import ArtRequestDetails from './ArtRequestDetails';
import AddressSelector from './AddressSelector';
import ShippingOptions from './ShippingOptions';
import PaymentMethodSelector from './PaymentMethodSelector';
import './OrderPage.css';

const OrderPage = () => {
    const { idArtRequest } = useParams();
    const navigate = useNavigate();
    const [artRequest, setArtRequest] = useState(null);
    const [artwork, setArtwork] = useState(null);
    const [size, setSize] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [shippingCosts, setShippingCosts] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [selectedCourier, setSelectedCourier] = useState('');
    const [selectedShippingIndex, setSelectedShippingIndex] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [selectedService, setSelectedService] = useState('');
    

    const paymentMethods = {
        bank_transfer: ['BCA', 'BRI', 'BNI', 'Permata', 'CIMB'],
        over_the_counter: ['Alfamart', 'Indomaret'],
        cardless_credit: ['Akulaku']
    };

    useEffect(() => {
        const fetchArtRequestDetails = async () => {
            try {
                const artRequestResponse = await axios.get(`/artrequestArtwork/request/artwork/${idArtRequest}`, {
                    headers: {
                        'Authorization': localStorage.getItem('Authorization'),
                        'Content-Type': 'application/json'
                    }
                });
                setArtRequest(artRequestResponse.data);

                const artworkResponse = await axios.get(`/artwork/data/${artRequestResponse.data.ID_Artwork}`, {
                    headers: {
                        'Authorization': localStorage.getItem('Authorization'),
                        'Content-Type': 'application/json'
                    }
                });
                setArtwork(artworkResponse.data);

                const sizeResponse = await axios.get(`/artwork/size/data/${artRequestResponse.data.ID_Size}`);
                setSize(sizeResponse.data);

                const addressesResponse = await axios.get('/addressapi/address', {
                    headers: {
                        'Authorization': localStorage.getItem('Authorization'),
                        'Content-Type': 'application/json'
                    }
                });
                setAddresses(addressesResponse.data);
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        };

        fetchArtRequestDetails();
    }, []);

    const handleAddressChange = (event) => {
        setSelectedAddress(event.target.value);
    };

    const handleGetShippingCost = async () => {
        if (!selectedAddress || !size) {
            Swal.fire({
                icon: 'warning',
                title: 'Select Address',
                text: 'Please select an address and ensure size data is loaded.',
            });
            return;
        }

        try {
            const payload = {
                ID_Origin: 1,
                ID_Address: selectedAddress,
                ID_Size: size.ID_Size,
            };

            const response = await axios.post('/shipment/data/cost', payload, {
                headers: {
                    'Authorization': `${localStorage.getItem('Authorization')}`,
                    'Content-Type': 'application/json'
                }
            });
            setShippingCosts(response.data.data);
        } catch (error) {
            console.error('Error fetching shipping cost:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch shipping cost.',
            });
        }
    };

    const handleCheckout = async () => {
        if (!selectedAddress || selectedShippingIndex === null || !selectedPaymentMethod || !selectedService) {
            Swal.fire({
                icon: 'warning',
                title: 'Complete your selection',
                text: 'Please select an address, shipping option, payment method, and service before proceeding to checkout.',
            });
            return;
        }
    
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to proceed with the checkout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, proceed',
            cancelButtonText: 'Cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Create Shipment
                    const selectedShippingObject = shippingCosts.find(cost => cost.courier === selectedCourier);
                    const selectedShippingDetail = selectedShippingObject.costDetails[selectedShippingIndex];
    
                    const shipmentPayload = {
                        courier: selectedShippingObject.courier,
                        service: selectedShippingObject.service,
                        cost: selectedShippingDetail.value,
                        etd: selectedShippingDetail.etd,
                    };
    
                    const shipmentResponse = await axios.post('/shipment/data', shipmentPayload, {
                        headers: {
                            'Authorization': localStorage.getItem('Authorization'),
                            'Content-Type': 'application/json'
                        }
                    });
    
                    const { ID_Shipment } = shipmentResponse.data;
    
                    // Create Order
                    const orderPayload = {
                        ID_ArtRequest: artRequest.ID_ArtRequest,
                        ID_Address: selectedAddress,
                        ID_Shipment: ID_Shipment,
                    };
    
                    const orderResponse = await axios.post('/order/data', orderPayload, {
                        headers: {
                            'Authorization': localStorage.getItem('Authorization'),
                            'Content-Type': 'application/json'
                        }
                    });
    
                    const { ID_Order } = orderResponse.data;
    
                    // Create Payment
                    const paymentPayload = {
                        transaction_details: {
                            order_id: ID_Order
                        },
                        payment_type: selectedPaymentMethod,
                    };
    
                    if (selectedPaymentMethod === 'bank_transfer') {
                        paymentPayload.bank_transfer = {
                            bank: selectedService.toLowerCase()
                        };
                    } else if (selectedPaymentMethod === 'over_the_counter') {
                        paymentPayload.over_the_counter = {
                            store: selectedService.toLowerCase()
                        };
                    } else if (selectedPaymentMethod === 'cardless_credit') {
                        paymentPayload.cardless_credit = {
                            provider: selectedService.toLowerCase()
                        };
                    }
    
                    const paymentResponse = await axios.post('/midtrans/create-payment', paymentPayload, {
                        headers: {
                            'Authorization': localStorage.getItem('Authorization'),
                            'Content-Type': 'application/json'
                        }
                    });
    
                    Swal.fire({
                        icon: 'success',
                        title: 'Payment Created',
                        text: 'Your payment has been created successfully!',
                    }).then(() => {
                        navigate(`/payment/${ID_Order}`); // Navigasi ke halaman pembayaran
                    });
    
                } catch (error) {
                    console.error('Error during checkout:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Checkout Failed',
                        text: 'Failed to create order or shipment. Please try again.',
                    });
                }
            }
        });
    };

    if (!artRequest || !artwork || !size) {
        return <div>Loading...</div>;
    }

    return (
        <div className="order-page-container">
            <h1 className="order-page-title">Order Details</h1>
            <ArtRequestDetails artwork={artwork} size={size} artRequest={artRequest} />
            <AddressSelector addresses={addresses} handleAddressChange={handleAddressChange} handleGetShippingCost={handleGetShippingCost} />
            <ShippingOptions shippingCosts={shippingCosts} selectedCourier={selectedCourier} handleCourierChange={setSelectedCourier} handleShippingOptionChange={setSelectedShippingIndex} selectedShippingIndex={selectedShippingIndex} />
            <PaymentMethodSelector paymentMethods={paymentMethods} selectedPaymentMethod={selectedPaymentMethod} handlePaymentMethodChange={setSelectedPaymentMethod} handleServiceChange={setSelectedService} selectedService={selectedService} />
            <button onClick={handleCheckout} className="checkout-button">Checkout</button>
        </div>
    );
};

export default OrderPage;
