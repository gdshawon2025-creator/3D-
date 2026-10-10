import React, { useState } from 'react';
import { Compass, Maximize2, Minimize2 } from 'lucide-react';
import { ZONES } from '../../data/portfolioData';
import { ZoneInfo } from '../../types/portfolio';

interface MinimapProps {
  vehicleX: number;
  vehicleZ: number;
  vehicleRotation: number;
  onTeleportToZone: (zone: ZoneInfo) => void;
  language: 'en' | 'bn';
}

export const Minimap: React.FC<MinimapProps> = ({
  vehicleX,
  vehicleZ,
  vehicleRotation,
  onTeleportToZone,
  language
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isBn = language === 'bn';

  // Map world coordinate (-60..60) to SVG viewbox (0..100)
  const mapSize = 130;
  const worldToMap = (val: number) => ((val + mapSize / 2) / mapSize) * 100;

  const carMapX = Math.max(5, Math.min(95, worldToMap(vehicleX)));
  const carMapY = Math.max(5, Math.min(95, worldToMap(vehicleZ)));

  return (
    <div
      className={`fixed top-18 sm:top-20 right-4 z-20 pointer-events-auto select-none transition-all duration-200 ${
        isExpanded ? 'w-64 h-64 sm:w-72 sm:h-72' : 'w-36 h-36 sm:w-44 sm:h-44'
      }`}
    >
      <div className="w-full h-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-2.5 shadow-2xl relative flex flex-col">
        {/* Header bar */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1 px-1">
          <span className="flex items-center gap-1 font-bold text-slate-300">
            <Compass className="w-3 h-3 text-orange-400" />
            {isBn ? 'মিনিম্যাপ' : 'RADAR'}
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hover:text-white p-0.5"
            title={isExpanded ? 'Minimize Radar' : 'Expand Radar'}
          >
            {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
        </div>

        {/* SVG Radar Map */}
        <div className="relative flex-1 bg-slate-950/80 rounded-xl overflow-hidden border border-slate-800/60">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Grid coordinate markers */}
            <circle cx="50" cy="50" r="48" fill="none" stroke="#1e293b" strokeWidth="0.8" />
            <circle cx="50" cy="50" r="32" fill="none" stroke="#1e293b" strokeWidth="0.6" strokeDasharray="2,2" />
            <circle cx="50" cy="50" r="16" fill="none" stroke="#1e293b" strokeWidth="0.6" strokeDasharray="2,2" />
            <line x1="50" y1="2" x2="50" y2="98" stroke="#1e293b" strokeWidth="0.6" />
            <line x1="2" y1="50" x2="98" y2="50" stroke="#1e293b" strokeWidth="0.6" />

            {/* Roads */}
            <line x1="50" y1="50" x2="74" y2="28" stroke="#334155" strokeWidth="2.5" />
            <line x1="50" y1="50" x2="26" y2="28" stroke="#334155" strokeWidth="2.5" />
            <line x1="50" y1="50" x2="74" y2="72" stroke="#334155" strokeWidth="2.5" />
            <line x1="50" y1="50" x2="26" y2="72" stroke="#334155" strokeWidth="2.5" />
            <line x1="50" y1="50" x2="50" y2="15" stroke="#334155" strokeWidth="2.5" />

            {/* Interactive Zone Pins */}
            {ZONES.map((zone) => {
              const zx = worldToMap(zone.x);
              const zy = worldToMap(zone.z);
              return (
                <g
                  key={zone.id}
                  className="cursor-pointer transition-transform hover:scale-125"
                  onClick={() => onTeleportToZone(zone)}
                >
                  <circle
                    cx={zx}
                    cy={zy}
                    r={zone.id === 'start' ? 3.5 : 4.5}
                    fill={zone.color}
                    opacity="0.85"
                  />
                  <circle
                    cx={zx}
                    cy={zy}
                    r={zone.id === 'start' ? 5.5 : 7.0}
                    fill="none"
                    stroke={zone.color}
                    strokeWidth="0.8"
                    opacity="0.4"
                  />
                  {isExpanded && (
                    <text
                      x={zx}
                      y={zy - 6}
                      fill="#f8fafc"
                      fontSize="4.5"
                      fontFamily="sans-serif"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {isBn ? zone.nameBn : zone.name}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Vehicle Indicator: Blinking Dot + Heading Direction Arrow */}
            <g
              transform={`translate(${carMapX}, ${carMapY}) rotate(${(vehicleRotation * 180) / Math.PI})`}
            >
              {/* Heading arrow */}
              <polygon points="0,-4.5 2.5,2.5 0,1.2 -2.5,2.5" fill="#f97316" />
              <circle cx="0" cy="0" r="2.2" fill="#ffffff" />
            </g>
          </svg>
        </div>

        {/* Quick Helper Subtext */}
        <div className="text-[9px] text-slate-400 text-center mt-1 truncate">
          {isBn ? 'জোনে ক্লিক করে টেলিপোর্ট করুন' : 'Click any dot to fast travel'}
        </div>
      </div>
    </div>
  );
};
