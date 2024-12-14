import React, { useState, useEffect } from 'react';
import QuantumCircuit from 'quantum-circuit';

const QuantumCoinFlip = () => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [quantumState, setQuantumState] = useState('Click to flip the quantum coin!');
  const [circuitVisible, setCircuitVisible] = useState(false);
  const [superpositionVisible, setSuperpositionVisible] = useState(false);
  const [measurementResult, setMeasurementResult] = useState(null);
  const [coinRotation, setCoinRotation] = useState(0);

  const performQuantumFlip = async () => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    setCircuitVisible(true);
    setMeasurementResult(null);
    setCoinRotation(0);
    
    // Show superposition after delay
    setTimeout(() => {
      setSuperpositionVisible(true);
    }, 800);

    try {
      // Create quantum circuit with 1 qubit
      const circuit = new QuantumCircuit(1);
      circuit.addGate("h", 0, [0]);
      circuit.run();
      const measurement = circuit.measure(0);

      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update measurement result
      setMeasurementResult(measurement === 0 ? 'Heads' : 'Tails');
      setCoinRotation(measurement === 0 ? 0 : 180);
      
    } catch (error) {
      setQuantumState("Error: " + error.message);
    }

    // Reset states
    setTimeout(() => {
      setCircuitVisible(false);
      setSuperpositionVisible(false);
      setIsFlipping(false);
    }, 2000);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      margin: 0,
      background: 'linear-gradient(45deg, #6b3fa0, #4a90e2)',
      fontFamily: 'Arial, sans-serif',
      color: 'white'
    }}>
      <h1>Quantum Coin Flip</h1>
      
      <div className="coin" style={{
        width: '150px',
        height: '150px',
        position: 'relative',
        margin: '20px',
        cursor: 'pointer',
        transition: 'transform 0.6s',
        transformStyle: 'preserve-3d',
        transform: `rotateY(${coinRotation}deg)`,
        animation: isFlipping ? 'flip 1.5s ease-in-out, quantum-glitch 0.2s infinite' : 'none'
      }}>
        <div className="coin-face heads" style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          backfaceVisibility: 'hidden',
          background: 'gold',
          border: '4px solid #ffd700'
        }}>H</div>
        <div className="coin-face tails" style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          backfaceVisibility: 'hidden',
          background: 'silver',
          border: '4px solid #c0c0c0',
          transform: 'rotateY(180deg)'
        }}>T</div>
      </div>

      <button 
        onClick={performQuantumFlip}
        disabled={isFlipping}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          border: 'none',
          borderRadius: '25px',
          background: '#fff',
          color: '#6b3fa0',
          cursor: isFlipping ? 'not-allowed' : 'pointer',
          transition: 'transform 0.2s',
          transform: 'scale(1)',
          ':hover': {
            transform: 'scale(1.05)'
          }
        }}
      >
        {isFlipping ? 'Flipping...' : 'Flip Quantum Coin'}
      </button>

      <div className="quantum-state" style={{
        marginTop: '20px',
        fontSize: '18px',
        textAlign: 'center',
        padding: '15px',
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '10px',
        maxWidth: '600px'
      }}>
        {superpositionVisible && (
          <div className="fade-in">
            <div style={{ color: '#00ffff', marginBottom: '10px' }}>Superposition:</div>
            <div style={{ fontFamily: 'monospace' }}>H|0⟩ → |ψ⟩ = (|H⟩ + |T⟩)/√2</div>
            <div style={{ fontSize: '0.8em', marginTop: '5px' }}>Both heads and tails at once!</div>
          </div>
        )}
        {measurementResult && (
          <div style={{ color: '#00ff00' }}>
            Result: {measurementResult}!
            <div style={{ fontSize: '0.8em' }}>State: |{measurementResult === 'Heads' ? 'H' : 'T'}⟩</div>
          </div>
        )}
      </div>

      {/* Add the quantum explanation section from your example */}
      <div className="info-box" style={{
        marginTop: '30px',
        maxWidth: '600px',
        padding: '20px',
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '10px'
      }}>
        <h3 style={{ color: '#00ffff' }}>How is this different from regular computing?</h3>
        {/* Add the rest of your explanation content here */}
      </div>
    </div>
  );
};

export default QuantumCoinFlip;