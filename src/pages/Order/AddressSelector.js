import React from 'react';
import './AddressSelector.css';

const AddressSelector = ({ addresses, handleAddressChange, handleGetShippingCost }) => {
    return (
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
            <button onClick={handleGetShippingCost} className="get-shipping-cost-button">Get Shipping Cost</button>
        </div>
    );
};

export default AddressSelector;
