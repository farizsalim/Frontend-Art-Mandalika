import React from 'react';
import './PaymentMethodSelector.css';

const PaymentMethodSelector = ({ paymentMethods, selectedPaymentMethod, handlePaymentMethodChange, handleServiceChange, selectedService }) => {
    return (
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
    );
};

export default PaymentMethodSelector;
