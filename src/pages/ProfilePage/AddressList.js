import React, { useEffect, useState } from 'react';
import axios from '../../api/backend/index';
import Swal from 'sweetalert2';
import { Modal, Button, Form } from 'react-bootstrap';

const AddressList = () => {
    const [addresses, setAddresses] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [newAddress, setNewAddress] = useState({
        recipientName: '',
        description: '',
        district: '',
        village: '',
        city: '',
        province: '',
        postalCode: '',
        country: 'Indonesia',
        isPrimary: false,
        type: ''
    });
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        fetchAddresses();
        fetchProvinces();
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await axios.get('/addressapi/address', {
                headers: {
                    'Authorization': localStorage.getItem('Authorization'),
                    'Content-Type': 'application/json'
                }
            });
            setAddresses(response.data);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const fetchProvinces = async () => {
        try {
            const response = await axios.get('/test/provinces');
            setProvinces(response.data);
        } catch (error) {
            console.error('Error fetching provinces:', error);
        }
    };

    const fetchCities = async (provinceId) => {
        try {
            const response = await axios.get(`/test/cities?province=${provinceId}`);
            setCities(response.data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAddress({ ...newAddress, [name]: value });
    };

    const handleProvinceChange = (e) => {
        const provinceId = e.target.value;
        const selectedProvinceName = provinces.find(p => p.province_id === provinceId)?.province;
        setSelectedProvince(provinceId);
        setNewAddress({ ...newAddress, province: selectedProvinceName, city: '', type: '', postalCode: '' });
        fetchCities(provinceId);
    };

    const handleCityChange = (e) => {
        const cityId = e.target.value;
        const selectedCity = cities.find(c => c.city_id === cityId);
        if (selectedCity) {
            setNewAddress({
                ...newAddress,
                city: selectedCity.city_name,
                type: selectedCity.type,
                postalCode: selectedCity.postal_code
            });
        }
    };

    const handleAddAddress = async () => {
        try {
            await axios.post('/addressapi/address', newAddress, {
                headers: {
                    'Authorization': localStorage.getItem('Authorization'),
                    'Content-Type': 'application/json'
                }
            });
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Address added successfully!',
                confirmButtonText: 'OK'
            });
            setShowAddModal(false);
            fetchAddresses();
        } catch (error) {
            console.error('Error adding address:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add address. Please try again.',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleSetPrimaryAddress = async (addressId) => {
        try {
            await axios.patch(`/addressapi/address/${addressId}/set-primary`, {}, {
                headers: {
                    'Authorization': localStorage.getItem('Authorization'),
                    'Content-Type': 'application/json'
                }
            });
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Primary address set successfully!',
                confirmButtonText: 'OK'
            });
            fetchAddresses();
        } catch (error) {
            console.error('Error setting primary address:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to set primary address. Please try again.',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleDeleteAddress = async (addressId) => {
        try {
            await axios.delete(`/addressapi/address/${addressId}`, {
                headers: {
                    'Authorization': localStorage.getItem('Authorization'),
                    'Content-Type': 'application/json'
                }
            });
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Address deleted successfully!',
                confirmButtonText: 'OK'
            });
            fetchAddresses();
        } catch (error) {
            console.error('Error deleting address:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete address. Please try again.',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div className="address-list">
            <h4>Addresses</h4>
            <button
                className="btn btn-primary mb-3"
                onClick={() => setShowAddModal(true)}
            >
                Add Address
            </button>
            <table className="table table-hover table-striped table-bordered align-middle">
                <thead className="table-primary text-center">
                    <tr>
                        <th>Recipient Name</th>
                        <th>Address</th>
                        <th>District</th>
                        <th>Village</th>
                        <th>City</th>
                        <th>Province</th>
                        <th>Postal Code</th>
                        <th>Country</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {addresses.map((address) => (
                        <tr key={address.ID_Address}>
                            <td className="text-center">{address.RecipientName}</td>
                            <td>{address.Description}</td>
                            <td className="text-center">{address.District}</td>
                            <td className="text-center">{address.Village}</td>
                            <td className="text-center">{address.City}</td>
                            <td className="text-center">{address.Province}</td>
                            <td className="text-center">{address.PostalCode}</td>
                            <td className="text-center">{address.Country}</td>
                            <td className="text-center">
                                {address.IsPrimary ? (
                                    <span className="badge bg-success">Primary</span>
                                ) : (
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => handleSetPrimaryAddress(address.ID_Address)}
                                    >
                                        Choose Primary
                                    </button>
                                )}
                            </td>
                            <td className="text-center">
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDeleteAddress(address.ID_Address)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for Adding New Address */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Address</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="recipientName" className="mb-3">
                            <Form.Label>Recipient Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="recipientName"
                                placeholder="Enter recipient name"
                                value={newAddress.recipientName}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="description" className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                placeholder="Enter address"
                                value={newAddress.description}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="district" className="mb-3">
                            <Form.Label>District</Form.Label>
                            <Form.Control
                                type="text"
                                name="district"
                                placeholder="Enter district"
                                value={newAddress.district}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="village" className="mb-3">
                            <Form.Label>Village</Form.Label>
                            <Form.Control
                                type="text"
                                name="village"
                                placeholder="Enter village"
                                value={newAddress.village}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="province" className="mb-3">
                            <Form.Label>Province</Form.Label>
                            <Form.Control
                                as="select"
                                name="province"
                                value={selectedProvince}
                                onChange={handleProvinceChange}
                            >
                                <option value="">Select Province</option>
                                {provinces.map((province) => (
                                    <option key={province.province_id} value={province.province_id}>
                                        {province.province}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="city" className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                as="select"
                                name="city"
                                value={newAddress.city}
                                onChange={handleCityChange}
                                disabled={!selectedProvince}
                            >
                                <option value="">Select City</option>
                                {cities.map((city) => (
                                    <option key={city.city_id} value={city.city_id}>
                                        {city.city_name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="postalCode" className="mb-3">
                            <Form.Label>Postal Code</Form.Label>
                            <Form.Control
                                type="text"
                                name="postalCode"
                                placeholder="Enter postal code"
                                value={newAddress.postalCode}
                                onChange={handleInputChange}
                                readOnly
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddAddress}>
                        Save Address
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AddressList;
