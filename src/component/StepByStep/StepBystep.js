import React from 'react';
import './StepByStep.css';
import { image_2, image_3, image_4 } from '../../assets/image/home/asset';

const steps = [
  {
    image: image_4,
    text: 'Make A Request'
  },
  {
    image: image_2,
    text: 'Your request is being created.'
  },
  {
    image: image_3,
    text: 'Your piece has been completed and received by you.'
  }
];

const StepByStep = () => {
  return (
    <div className="step-by-step-container">
      <h2 className="step-title">Step by Step</h2>
      <div className="step-grid">
        {steps.map((step, index) => (
          <div key={index} className="step-item">
            <img src={step.image} alt={`Step ${index + 1}`} className="step-image" loading="lazy" />
            <div className="step-overlay">
              <p className="step-text">{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepByStep;
