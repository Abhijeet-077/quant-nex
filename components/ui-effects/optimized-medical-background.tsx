"use client"

import React from 'react'

export function OptimizedMedicalBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      
      {/* Medical grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Subtle medical cross pattern */}
      <div className="absolute inset-0">
        <svg 
          className="absolute inset-0 w-full h-full opacity-5" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="medical-cross" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <g fill="#3b82f6">
                <rect x="50" y="30" width="20" height="60" />
                <rect x="30" y="50" width="60" height="20" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#medical-cross)" />
        </svg>
      </div>
      
      {/* DNA helix pattern - subtle */}
      <div className="absolute inset-0">
        <svg 
          className="absolute right-0 top-0 w-1/3 h-full opacity-8" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="dna-helix" x="0" y="0" width="60" height="200" patternUnits="userSpaceOnUse">
              <path 
                d="M30,0 Q45,50 30,100 Q15,150 30,200" 
                stroke="#3b82f6" 
                strokeWidth="2" 
                fill="none" 
                opacity="0.3"
              />
              <path 
                d="M30,0 Q15,50 30,100 Q45,150 30,200" 
                stroke="#06b6d4" 
                strokeWidth="2" 
                fill="none" 
                opacity="0.3"
              />
              <circle cx="30" cy="25" r="3" fill="#3b82f6" opacity="0.4" />
              <circle cx="30" cy="75" r="3" fill="#06b6d4" opacity="0.4" />
              <circle cx="30" cy="125" r="3" fill="#3b82f6" opacity="0.4" />
              <circle cx="30" cy="175" r="3" fill="#06b6d4" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dna-helix)" />
        </svg>
      </div>
      
      {/* Heartbeat/EKG line pattern */}
      <div className="absolute inset-0">
        <svg 
          className="absolute left-0 bottom-0 w-full h-32 opacity-15" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 100"
        >
          <path 
            d="M0,50 L200,50 L220,20 L240,80 L260,10 L280,90 L300,50 L500,50 L520,20 L540,80 L560,10 L580,90 L600,50 L800,50 L820,20 L840,80 L860,10 L880,90 L900,50 L1200,50" 
            stroke="#10b981" 
            strokeWidth="2" 
            fill="none"
            opacity="0.6"
          />
        </svg>
      </div>
      
      {/* Molecular structure pattern - corner accent */}
      <div className="absolute top-0 left-0 w-64 h-64">
        <svg 
          className="w-full h-full opacity-10" 
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
        >
          <g fill="none" stroke="#8b5cf6" strokeWidth="1">
            <circle cx="50" cy="50" r="8" fill="#8b5cf6" opacity="0.3" />
            <circle cx="150" cy="50" r="8" fill="#06b6d4" opacity="0.3" />
            <circle cx="100" cy="120" r="8" fill="#10b981" opacity="0.3" />
            <circle cx="50" cy="150" r="8" fill="#f59e0b" opacity="0.3" />
            <circle cx="150" cy="150" r="8" fill="#ef4444" opacity="0.3" />
            
            <line x1="50" y1="50" x2="150" y2="50" />
            <line x1="50" y1="50" x2="100" y2="120" />
            <line x1="150" y1="50" x2="100" y2="120" />
            <line x1="100" y1="120" x2="50" y2="150" />
            <line x1="100" y1="120" x2="150" y2="150" />
          </g>
        </svg>
      </div>
      
      {/* Cancer cell visualization - subtle background element */}
      <div className="absolute bottom-0 right-0 w-96 h-96">
        <svg 
          className="w-full h-full opacity-8" 
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 300 300"
        >
          <defs>
            <radialGradient id="cell-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="70%" stopColor="#3b82f6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
            </radialGradient>
          </defs>
          
          {/* Main cell body */}
          <circle cx="150" cy="150" r="80" fill="url(#cell-gradient)" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
          
          {/* Cell nucleus */}
          <circle cx="150" cy="150" r="30" fill="#8b5cf6" opacity="0.2" stroke="#8b5cf6" strokeWidth="1" />
          
          {/* Organelles */}
          <circle cx="120" cy="120" r="8" fill="#06b6d4" opacity="0.3" />
          <circle cx="180" cy="130" r="6" fill="#10b981" opacity="0.3" />
          <circle cx="140" cy="180" r="7" fill="#f59e0b" opacity="0.3" />
          <circle cx="170" cy="170" r="5" fill="#ef4444" opacity="0.3" />
          
          {/* Cell membrane details */}
          <path 
            d="M70,150 Q100,140 130,150 Q160,160 190,150 Q220,140 250,150" 
            stroke="#3b82f6" 
            strokeWidth="1" 
            fill="none" 
            opacity="0.4"
          />
        </svg>
      </div>
      
      {/* Subtle radial glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/3 rounded-full blur-3xl" />
    </div>
  )
}

export function MedicalPatternOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Subtle animated pulse for medical monitoring feel */}
      <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full animate-pulse opacity-60" />
      <div className="absolute top-4 right-12 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-40" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-4 right-20 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-40" style={{ animationDelay: '1s' }} />
      
      {/* Medical status indicators */}
      <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-xs text-gray-500 font-mono">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span>SYSTEM ACTIVE</span>
      </div>
      
      {/* Subtle corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32">
        <div className="absolute top-4 left-4 w-8 h-0.5 bg-blue-400/30" />
        <div className="absolute top-4 left-4 w-0.5 h-8 bg-blue-400/30" />
      </div>
      
      <div className="absolute top-0 right-0 w-32 h-32">
        <div className="absolute top-4 right-4 w-8 h-0.5 bg-cyan-400/30" />
        <div className="absolute top-4 right-4 w-0.5 h-8 bg-cyan-400/30" />
      </div>
      
      <div className="absolute bottom-0 left-0 w-32 h-32">
        <div className="absolute bottom-4 left-4 w-8 h-0.5 bg-purple-400/30" />
        <div className="absolute bottom-4 left-4 w-0.5 h-8 bg-purple-400/30" />
      </div>
      
      <div className="absolute bottom-0 right-0 w-32 h-32">
        <div className="absolute bottom-4 right-4 w-8 h-0.5 bg-green-400/30" />
        <div className="absolute bottom-4 right-4 w-0.5 h-8 bg-green-400/30" />
      </div>
    </div>
  )
}
