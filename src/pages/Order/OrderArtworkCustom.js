import React, { useState, useEffect } from 'react';
import axios from '../../api/backend/index';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';
import Spinner from '../../component/Spinner/SpinnerComponent'; // Import Spinner
import './OrderArtworkCustom.css'; // Import CSS untuk styling

const OrderArtworkCustom = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { artwork } = location.state || {}; // Mengambil data artwork dari state

    const [addresses, setAddresses] = useState([]);
    const [shippingCosts, setShippingCosts] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [selectedCourier, setSelectedCourier] = useState('');
    const [selectedShippingOption, setSelectedShippingOption] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingCourier, setLoadingCourier] = useState(false); // State untuk loading kurir

    const paymentMethods = {
        bank_transfer: ['BCA', 'BRI', 'BNI', 'Permata', 'CIMB'],
        over_the_counter: ['Alfamart', 'Indomaret'],
        cardless_credit: ['Akulaku']
    };

    console.log('Artwork ID_Detail:', artwork.ID_Detail);

    useEffect(() => {
        if (!artwork) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Artwork data is missing. Please go back and try again.',
            }).then(() => {
                navigate(-1);
            });
            return;
        }

        const fetchAddresses = async () => {
            setLoading(true);
            try {
                console.log('Fetching addresses...');
                const response = await axios.get('/addressapi/address', {
                    headers: {
                        'Authorization': localStorage.getItem('Authorization'),
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Addresses fetched successfully:', response.data);
                setAddresses(response.data);
            } catch (error) {
                console.error('Error fetching addresses:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch addresses.',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAddresses();
    }, [artwork, navigate]);

    const handleAddressChange = async (e) => {
        const addressId = e.target.value;
        setSelectedAddress(addressId);

        // Trigger shipping cost fetch when address is selected
        if (addressId) {
            await handleGetShippingCost(addressId);
        }
    };

    const handleGetShippingCost = async (addressId) => {
        if (!addressId || !artwork) {
            Swal.fire({
                icon: 'warning',
                title: 'Select Address',
                text: 'Please select an address and ensure artwork data is loaded.',
            });
            return;
        }

        setLoadingCourier(true); // Set loading for courier
        try {
            console.log('Fetching shipping cost...');
            const payload = {
                ID_Origin: 1, // Ganti dengan ID asal yang sesuai
                ID_Address: addressId,
                ID_Detail: artwork.ID_Detail, // Menggunakan ID dari artwork custom
            };

            const response = await axios.post('/shipment/data/cost', payload, {
                headers: {
                    'Authorization': `${localStorage.getItem('Authorization')}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Shipping cost fetched successfully:', response.data.data);
            setShippingCosts(response.data.data);
        } catch (error) {
            console.error('Error fetching shipping cost:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch shipping cost.',
            });
        } finally {
            setLoadingCourier(false); // Set loading for courier to false
        }
    };

    const handlePaymentMethodChange = (method) => {
        setSelectedPaymentMethod(method);
        setSelectedService('');
    };

    const handleServiceChange = (service) => {
        setSelectedService(service);
    };

    const handleCheckout = async () => {
        if (!selectedAddress || !selectedShippingOption || !selectedPaymentMethod || !selectedService) {
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
                setLoading(true);
                try {
                    console.log('Creating shipment...');
                    const selectedShippingObject = shippingCosts.find(cost => cost.courier === selectedCourier);
                    const selectedShippingDetail = selectedShippingObject.costDetails[selectedShippingOption];

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
                    console.log('Shipment created successfully:', shipmentResponse.data);

                    const { ID_Shipment } = shipmentResponse.data;

                    // Payload untuk order sesuai dengan format yang diinginkan
                    const orderPayload = {
                        ID_ArtworkCustom: artwork.ID_ArtworkCustom, // Menggunakan ID dari artwork custom
                        ID_ArtworkDetail: artwork.ID_Detail, // Menggunakan ID detail artwork
                        ID_Address: parseInt(selectedAddress, 10), // ID alamat yang dipilih
                        ID_Shipment: ID_Shipment // ID pengiriman yang diterima
                    };

                    console.log('Creating order with payload:', orderPayload);
                    const orderResponse = await axios.post('http://localhost:8000/ARTM/api/order/datacustom', orderPayload, {
                        headers: {
                            'Authorization': localStorage.getItem('Authorization'),
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log('Order created successfully:', orderResponse.data);

                    const { ID_Order } = orderResponse.data;

                    // Lanjutkan dengan proses pembayaran
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

                    console.log('Creating payment with payload:', paymentPayload);
                    await axios.post('/midtrans/create-payment-custom', paymentPayload, {
                        headers: {
                            'Authorization': localStorage.getItem('Authorization'),
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log('Payment created successfully');

                    Swal.fire({
                        icon: 'success',
                        title: 'Payment Created',
                        text: 'Your payment has been created successfully!',
                    }).then(() => {
                        navigate(`/payment/${ID_Order}`);
                    });

                } catch (error) {
                    console.error('Error during checkout:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Checkout Failed',
                        text: 'Failed to create order or shipment. Please try again.',
                    });
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    if (!artwork) {
        return <div>Loading...</div>; // Menangani kasus jika tidak ada data
    }

    return (
        <div className="order-page-container">
            <h1 className="order-page-title">Order Details</h1>
            {/* ArtRequestDetails Section */}
            <div className="order-card">
                <h3>Art Request</h3>
                <p><strong>Artwork:</strong> {artwork.Title_artwork}</p>
                <p><strong>Description:</strong> {artwork.Description}</p>
                <p><strong>Price:</strong> Rp {parseFloat(artwork.Price).toLocaleString('id-ID')}</p>
            </div>

            {/* Address Selector Section */}
            <div className="address-section">
                <h2>Select Address</h2>
                {addresses.length > 0 ? (
                    <select onChange={handleAddressChange} defaultValue="">
                        <option value="" disabled>Select an address</option>
                        {addresses.map(address => (
                            <option key={address.ID_Address} value={address.ID_Address}>
                                {address.Street}, {address.City}, {address.Province}
                            </option>
                        ))}
                    </select>
                ) : (
                    <p>No addresses available. Please add an address.</p>
                )}
            </div>

            {/* Shipping Options Section */}
            <div className="shipping-costs-section">
                <h2>Select Courier</h2>
                {loadingCourier ? (
                    <Spinner /> // Tampilkan spinner saat loading kurir
                ) : (
                    <>
                        <select onChange={(e) => setSelectedCourier(e.target.value)} defaultValue="">
                            <option value="" disabled>Select a courier</option>
                            {[...new Set(shippingCosts.map(cost => cost.courier))].map((courier, index) => (
                                <option key={index} value={courier}>{courier}</option>
                            ))}
                        </select>

                        {selectedCourier && (
                            <div className="shipping-options">
                                <h3>Available Services for {selectedCourier}</h3>
                                <select onChange={(e) => setSelectedShippingOption(e.target.value)} defaultValue="">
                                    <option value="" disabled>Select a shipping option</option>
                                    {shippingCosts.filter(cost => cost.courier === selectedCourier).map((cost, costIndex) => (
                                        cost.costDetails.map((detail, index) => (
                                            <option key={`${costIndex}-${index}`} value={index}>
                                                {cost.service} - Rp {detail.value.toLocaleString('id-ID')} (Estimated Delivery: {detail.etd} days)
                                            </option>
                                        ))
                                    ))}
                                </select>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Payment Method Selector Section */}
            <div className="payment-method-section">
                <h2>Select Payment Method</h2>
                <select onChange={(e) => handlePaymentMethodChange(e.target.value)} defaultValue="">
                    <option value="" disabled>Select a payment method</option>
                    {Object.keys(paymentMethods).map((method, index) => (
                        <option key={index} value={method}>{method.replace('_', ' ').toUpperCase()}</option>
                    ))}
                </select>

                {selectedPaymentMethod && paymentMethods[selectedPaymentMethod] && (
                    <div className="payment-services">
                        <h3>Available Services for {selectedPaymentMethod.replace('_', ' ').toUpperCase()}</h3>
                        <select onChange={(e) => handleServiceChange(e.target.value)} value={selectedService || ''}>
                            <option value="" disabled>Select a service</option>
                            {paymentMethods[selectedPaymentMethod].map((service, index) => (
                                <option key={index} value={service}>{service}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <button onClick={handleCheckout} className="checkout-button">Checkout</button>

            {loading && <Spinner />}
        </div>
    );
};

export default OrderArtworkCustom;
