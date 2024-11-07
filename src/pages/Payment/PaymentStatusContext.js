import React, { createContext, useState, useContext } from 'react';

const PaymentStatusContext = createContext();

export const PaymentStatusProvider = ({ children }) => {
    const [paymentStatus, setPaymentStatus] = useState('');

    return (
        <PaymentStatusContext.Provider value={{ paymentStatus, setPaymentStatus }}>
            {children}
        </PaymentStatusContext.Provider>
    );
};

export const usePaymentStatus = () => useContext(PaymentStatusContext);
