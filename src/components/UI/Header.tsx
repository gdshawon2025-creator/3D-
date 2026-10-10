import React from 'react';
import { Volume2, VolumeX, Moon, Sun, Camera, RotateCcw, Palette, HelpCircle, Compass } from 'lucide-react';
import { CameraMode, ZoneInfo } from '../../types/portfolio';
import { ZONES } from '../../data/portfolioData';

interface HeaderProps {
  isNightMode: boolean;
  onToggleNightMode: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  cameraMode: CameraMode;
  onChangeCameraMode: (mode: CameraMode) => void;
  vehicleColor: string;
  onChangeVehicleColor: (color: string) => void;
  language: 'en' | 'bn';
  onToggleLanguage: () => void;
  onOpenControlsHelp: () => void;
  onResetVehicle: () => void;
  onTeleportToZone: (zone: ZoneInfo) => void;
  currentZoneId: string | null;
}

const VEHICLE_COLORS = [
  { name: 'Pantone 021 Orange', hex: '#ea580c' },
  { name: 'Process Cyan (C)', hex: '#06b6d4' },
  { name: 'Process Magenta (M)', hex: '#ec4899' },
  { name: 'Process Yellow (Y)', hex: '#eab308' },
  { name: 'Emerald Vector', hex: '#10b981' },
  { name: 'Rich Black (K)', hex: '#18181b' }
];

export const Header: React.FC<HeaderProps> = ({
  isNightMode,
  onToggleNightMode,
  isMuted,
  onToggleMute,
  cameraMode,
  onChangeCameraMode,
  vehicleColor,
  onChangeVehicleColor,
  language,
  onToggleLanguage,
  onOpenControlsHelp,
  onResetVehicle,
  onTeleportToZone,
  currentZoneId
}) => {
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const isBn = language === 'bn';

  return (
    <header className="fixed top-0 left-0 right-0 z-30 pointer-events-none select-none p-3 sm:p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Reel-Inspired Title & Brand Badge */}
        <div className="pointer-events-auto flex items-center gap-2.5 bg-slate-900/80 backdrop-blur-md border border-slate-800/80 px-3.5 py-2 rounded-xl shadow-lg">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 via-rose-500 to-amber-500 flex items-center justify-center font-black text-white text-xs shadow-inner">
            Ai
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-white font-display">
                {isBn ? 'শাওন গ্রাফিক্স' : 'SHAWON GRAPHICS'}
              </h1>
              <span className="text-[10px] text-orange-400 font-medium px-1.5 py-0.5 rounded bg-orange-950/70 border border-orange-800/60 hidden sm:inline-block">
                {isBn ? '৩ডি স্টুডিও' : '3D Design Studio'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium hidden sm:block">
              {isBn ? 'গ্রাফিক্স ডিজাইনার শাওন · ব্র্যান্ডিং ও ভিজ্যুয়াল আর্ট' : 'Graphics Designer Shawon · Visual Branding & Art'}
            </p>
          </div>
        </div>

        {/* Center: Zone Teleport Quick Tabs */}
        <nav className="pointer-events-auto hidden lg:flex items-center gap-1 bg-slate-900/75 backdrop-blur-md border border-slate-800/80 px-2 py-1.5 rounded-xl shadow-lg">
          {ZONES.map((zone) => {
            const isActive = currentZoneId === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => onTeleportToZone(zone)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {isBn ? zone.nameBn : zone.name}
              </button>
            );
          })}
        </nav>

        {/* Right: Controls & Actions */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-800/80 p-1.5 rounded-xl shadow-lg">
          {/* Sound Mute/Unmute */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            title={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
            className={`p-2 rounded-lg transition-colors ${
              isMuted
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                : 'text-orange-400 bg-orange-950/50 hover:bg-orange-900/50'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Day / Night Mode */}
          <button
            onClick={onToggleNightMode}
            aria-label="Toggle Lighting"
            title={isNightMode ? 'Switch to daylight' : 'Switch to night mode'}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
          >
            {isNightMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
          </button>

          {/* Camera Mode */}
          <button
            onClick={() => {
              const nextMode: Record<CameraMode, CameraMode> = {
                chase: 'topdown',
                topdown: 'free',
                free: 'chase'
              };
              onChangeCameraMode(nextMode[cameraMode]);
            }}
            aria-label="Camera Angle"
            title={`Camera: ${cameraMode.toUpperCase()} (Click to change)`}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors flex items-center gap-1 text-xs"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden md:inline uppercase text-[10px] font-mono">{cameraMode}</span>
          </button>

          {/* Vehicle Color Picker Popover Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              aria-label="Vehicle Paint"
              title="Customize vehicle color"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors flex items-center gap-1"
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/20 inline-block shadow-sm"
                style={{ backgroundColor: vehicleColor }}
              />
              <Palette className="w-3.5 h-3.5 hidden sm:inline" />
            </button>

            {showColorPicker && (
              <div className="absolute right-0 top-full mt-2 p-2 bg-slate-900 border border-slate-800 rounded-xl shadow-xl flex gap-1.5 z-40">
                {VEHICLE_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => {
                      onChangeVehicleColor(c.hex);
                      setShowColorPicker(false);
                    }}
                    title={c.name}
                    className="w-6 h-6 rounded-lg transition-transform hover:scale-110 border border-white/20"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Reset Vehicle */}
          <button
            onClick={onResetVehicle}
            aria-label="Reset Vehicle Position"
            title="Reset monster truck to spawn circle (R)"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLanguage}
            title="Toggle Language / ভাষা পরিবর্তন"
            className="px-2 py-1 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
          >
            {isBn ? 'EN' : 'বাং'}
          </button>

          {/* Controls Help */}
          <button
            onClick={onOpenControlsHelp}
            aria-label="Controls Guide"
            title="View keyboard & touch controls"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
