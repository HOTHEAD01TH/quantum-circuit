import React, { useState } from 'react';
import QuantumCircuit from 'quantum-circuit';
import { motion, AnimatePresence } from 'framer-motion';
import { FaAtom, FaInfoCircle, FaHistory, FaWaveSquare, FaBrain, FaChartLine } from 'react-icons/fa';

const QuantumCoinFlip = () => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [quantumState, setQuantumState] = useState('Click to flip the quantum coin!');
  const [circuitVisible, setCircuitVisible] = useState(false);
  const [superpositionVisible, setSuperpositionVisible] = useState(false);
  const [measurementResult, setMeasurementResult] = useState(null);
  const [coinRotation, setCoinRotation] = useState(0);
  const [flips, setFlips] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [stats, setStats] = useState({
    totalFlips: 0,
    headsCount: 0,
    tailsCount: 0,
    currentStreak: 0,
    longestStreak: 0
  });

  const performQuantumFlip = async () => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    setCircuitVisible(true);
    setMeasurementResult(null);
    setCoinRotation(0);

    try {
        // Create a new quantum circuit with 1 qubit
        const circuit = new QuantumCircuit(1);
        
        // Add Hadamard gate to create superposition
        circuit.addGate("h", 0, 0);
        
        // Add measurement
        circuit.addMeasure(0, "c", 0);
        
        // Run the circuit
        circuit.run();
        
        // Get the measurement result from classical register
        const result = circuit.getCregValue("c") === 0 ? "Heads" : "Tails";
        
        // Wait for animation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Update state with result
        setMeasurementResult(result);
        setCoinRotation(result === "Heads" ? 0 : 180);
        
        // Calculate probability from the quantum state
        const probs = circuit.probabilities();
        
        // Add to history
        setFlips(prev => [{
            result,
            timestamp: new Date().toLocaleTimeString(),
            probability: probs[0]  // Probability of |0⟩ state
        }, ...prev.slice(0, 9)]);
        
        // Update stats
        setStats(prev => {
            const lastResult = prev.flips?.[0]?.result;
            const isStreak = lastResult === result;
            
            return {
                totalFlips: prev.totalFlips + 1,
                headsCount: prev.headsCount + (result === "Heads" ? 1 : 0),
                tailsCount: prev.tailsCount + (result === "Tails" ? 1 : 0),
                currentStreak: isStreak ? prev.currentStreak + 1 : 1,
                longestStreak: Math.max(prev.longestStreak, isStreak ? prev.currentStreak + 1 : 1)
            };
        });

    } catch (error) {
        console.error("Quantum Circuit Error:", error);
        setQuantumState("Error in quantum computation");
    } finally {
        // Reset states
        setTimeout(() => {
            setCircuitVisible(false);
            setSuperpositionVisible(false);
            setIsFlipping(false);
        }, 2000);
    }
  };

  const QuantumCircuitDisplay = () => (
    <svg width="100%" height="120" viewBox="0 0 300 120">
      {/* Initial state */}
      <text x="10" y="60" fill="#00ffff">|0⟩</text>
      
      {/* Quantum wire */}
      <line x1="40" y1="60" x2="260" y2="60" 
            stroke="#00ffff" strokeWidth="2"/>
      
      {/* Hadamard gate */}
      <rect x="100" y="40" width="40" height="40" 
            fill="none" stroke="#00ffff" strokeWidth="2"/>
      <text x="112" y="65" fill="#00ffff">H</text>
      
      {/* Measurement symbol */}
      <path d="M200,40 L220,40 L220,80 L200,80 Z" 
            fill="none" stroke="#00ffff" strokeWidth="2"/>
      <path d="M210,40 L210,80" 
            stroke="#00ffff" strokeWidth="2"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#0a0a1f] overflow-hidden relative">
      {/* Quantum Background Effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="quantum-grid"></div>
        <div className="quantum-particles"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <FaAtom className="text-6xl text-cyan-400 animate-pulse mr-4" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
              Quantum Coin Flip
            </h1>
          </div>
          <p className="text-cyan-200 text-xl">Explore the Quantum Realm of Probability</p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Quantum Circuit Visualization */}
          <div className="lg:col-span-3 bg-black/30 rounded-2xl p-6 backdrop-blur-lg">
            <h3 className="flex items-center text-cyan-400 text-xl mb-4">
              <FaWaveSquare className="mr-2" />
              Quantum Circuit
            </h3>
            <div className="quantum-circuit-display">
              <QuantumCircuitDisplay />
              <div className="mt-4 text-sm text-cyan-300">
                <p>1. Initialize |0⟩ state</p>
                <p>2. Apply Hadamard (H) gate</p>
                <p>3. Measure quantum state</p>
              </div>
            </div>
          </div>

          {/* Center Column - Coin and Controls */}
          <div className="lg:col-span-6">
            <div className="flex flex-col items-center">
              {/* Quantum State Orb */}
              <motion.div 
                className="quantum-orb mb-8"
                animate={{
                  boxShadow: isFlipping 
                    ? ['0 0 20px #00ffff', '0 0 40px #00ffff', '0 0 20px #00ffff']
                    : '0 0 20px #00ffff'
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {/* Coin Component */}
                <motion.div 
                  className="coin-container"
                  animate={{
                    rotateY: isFlipping ? 720 : coinRotation,
                  }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                  <div className="coin">
                    <div className="coin-face heads">H</div>
                    <div className="coin-face tails">T</div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Control Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={performQuantumFlip}
                disabled={isFlipping}
                className="quantum-button"
              >
                <FaAtom className="mr-2" />
                {isFlipping ? 'Quantum Superposition...' : 'Initiate Quantum Flip'}
              </motion.button>

              {/* Quantum State Display */}
              <motion.div 
                className="quantum-state-display mt-8"
                animate={{
                  backgroundColor: superpositionVisible ? 
                    'rgba(0, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'
                }}
              >
                {/* State content */}
              </motion.div>
            </div>
          </div>

          {/* Right Column - Stats and History */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-black/30 rounded-2xl p-6 backdrop-blur-lg">
              <h3 className="flex items-center text-cyan-400 text-xl mb-4">
                <FaBrain className="mr-2" />
                Quantum Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Flips</span>
                  <span className="text-cyan-400 font-mono">{stats.totalFlips}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Heads Probability</span>
                  <span className="text-cyan-400 font-mono">
                    {stats.totalFlips ? ((stats.headsCount / stats.totalFlips) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Tails Probability</span>
                  <span className="text-cyan-400 font-mono">
                    {stats.totalFlips ? ((stats.tailsCount / stats.totalFlips) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Current Streak</span>
                  <span className="text-cyan-400 font-mono">{stats.currentStreak}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Longest Streak</span>
                  <span className="text-cyan-400 font-mono">{stats.longestStreak}</span>
                </div>
              </div>
            </div>

            <div className="bg-black/30 rounded-2xl p-6 backdrop-blur-lg">
              <h3 className="flex items-center text-cyan-400 text-xl mb-4">
                <FaHistory className="mr-2" />
                Flip History
              </h3>
              <div className="space-y-2">
                {flips.map((flip, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex items-center justify-between p-2 rounded bg-white/5"
                  >
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full ${
                        flip.result === 'Heads' ? 'bg-cyan-400' : 'bg-purple-400'
                      } mr-2`}></div>
                      <span className={`font-medium ${
                        flip.result === 'Heads' ? 'text-cyan-400' : 'text-purple-400'
                      }`}>
                        {flip.result}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-gray-400">{flip.timestamp}</span>
                      <span className="text-xs text-cyan-400">
                        P={flip.probability.toFixed(2)}
                      </span>
                    </div>
                  </motion.div>
                ))}
                {flips.length === 0 && (
                  <div className="text-gray-400 text-center">
                    No flips yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumCoinFlip;