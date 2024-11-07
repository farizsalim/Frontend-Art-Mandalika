import React from 'react';
import './ShippingOptions.css';

const ShippingOptions = ({ shippingCosts, selectedCourier, handleCourierChange, handleShippingOptionChange, selectedShippingIndex }) => {
    return (
        <div className="shipping-costs-section">
            <h2>Select Courier</h2>
            <select onChange={(e) => handleCourierChange(e.target.value)} defaultValue="">
                <option value="" disabled>Select a courier</option>
                {[...new Set(shippingCosts.map(cost => cost.courier))].map((courier, index) => (
                    <option key={index} value={courier}>{courier}</option>
                ))}
            </select>

            {selectedCourier && (
                <div className="shipping-options">
                    <h3>Available Services for {selectedCourier}</h3>
                    {shippingCosts.filter(cost => cost.courier === selectedCourier).map((cost, costIndex) => (
                        cost.costDetails.map((detail, index) => (
                            <div 
                                key={index} 
                                className={`shipping-option-card ${selectedShippingIndex === index ? 'selected' : ''}`}
                                onClick={() => handleShippingOptionChange(index)}
                            >
                                <input
                                    type="radio"
                                    name="shippingOption"
                                    value={index}
                                    checked={selectedShippingIndex === index}
                                    readOnly
                                />
                                <label className="shipping-label">
                                    <div className="shipping-card-content">
                                        <p className="service-name"><strong>{cost.service}</strong></p>
                                        <p className="cost">Rp {detail.value.toLocaleString('id-ID')}</p>
                                        <p className="delivery-time">Estimated Delivery: {detail.etd} days</p>
                                    </div>
                                </label>
                            </div>
                        ))
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShippingOptions;
