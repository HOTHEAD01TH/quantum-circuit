import React, { useState, useEffect } from 'react';
import QuantumCircuit from 'quantum-circuit';

const QuantumCoinFlip = () => {
  const [result, setResult] = useState(null);
  const [flips, setFlips] = useState([]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [probabilityDetails, setProbabilityDetails] = useState(null);

  const performQuantumCoinFlip = () => {
    // Create a new quantum circuit with 1 qubit
    const circuit = new QuantumCircuit(1);

    // Apply Hadamard gate to create superposition
    circuit.addGate("h", 0, 0);

    // Measure the qubit
    circuit.addMeasure(0, "c", 0);

    // Run the circuit
    circuit.run();

    // Get probabilities before measurement
    const beforeMeasurement = circuit.probabilities();

    // Get the measurement result
    const coinResult = circuit.measure(0);
    
    // Calculate detailed probability information
    const details = {
      beforeMeasurement: beforeMeasurement[0],
      finalResult: coinResult === 0 ? 'Heads' : 'Tails'
    };

    setProbabilityDetails(details);
    return coinResult === 0 ? 'Heads' : 'Tails';
  };

  const handleFlip = () => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    setProbabilityDetails(null);
    
    // Simulate coin flip animation
    const animationTimeout = setTimeout(() => {
      const quantumResult = performQuantumCoinFlip();
      setResult(quantumResult);
      setFlips(prev => [quantumResult, ...prev].slice(0, 5));
      setIsFlipping(false);
    }, 1000);

    return () => clearTimeout(animationTimeout);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
          Quantum Coin Flip
        </h1>
        
        {/* Coin Flip Button */}
        <div className="flex justify-center mb-6">
          <button 
            onClick={handleFlip}
            disabled={isFlipping}
            className={`
              px-8 py-4 rounded-full text-white font-bold tracking-wider uppercase 
              transition-all duration-300 transform hover:scale-105 active:scale-95
              ${isFlipping 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              }
            `}
          >
            {isFlipping ? 'Quantum Flipping...' : 'Quantum Flip'}
          </button>
        </div>
        
        {/* Result Display */}
        {result && (
          <div className="text-center mb-6">
            <p className="text-2xl font-semibold">
              Result: <span className={`
                font-bold 
                ${result === 'Heads' ? 'text-blue-600' : 'text-purple-600'}
              `}>
                {result}
              </span>
            </p>
          </div>
        )}
        
        {/* Probability Details */}
        {probabilityDetails && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-center">
            <h3 className="font-semibold text-blue-800 mb-2">
              Quantum Probability Breakdown
            </h3>
            <p className="text-sm text-gray-700">
              Pre-Measurement Probability of Heads: 
              <span className="font-bold text-blue-600 ml-2">
                {(probabilityDetails.beforeMeasurement * 100).toFixed(2)}%
              </span>
            </p>
            <p className="text-sm text-gray-700">
              Final Result: 
              <span className="font-bold text-purple-600 ml-2">
                {probabilityDetails.finalResult}
              </span>
            </p>
          </div>
        )}
        
        {/* Recent Flips */}
        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-lg font-semibold mb-3 text-center text-gray-700">
            Recent Quantum Flips
          </h2>
          <div className="flex justify-center space-x-2">
            {flips.map((flip, index) => (
              <span 
                key={index} 
                className={`
                  px-3 py-1 rounded-full text-sm font-medium
                  ${flip === 'Heads' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-purple-100 text-purple-800'
                  }
                `}
              >
                {flip}
              </span>
            ))}
          </div>
        </div>
        
        {/* Quantum Explanation */}
        <div className="mt-6 text-center text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <p>
            🔬 Quantum Coin Flip uses a Hadamard gate to create a true quantum superposition. 
            The measurement collapses the qubit, providing a fundamentally random result 
            based on quantum mechanical principles.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuantumCoinFlip;