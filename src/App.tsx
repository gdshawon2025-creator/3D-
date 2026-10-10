import React, { useState, useEffect, useCallback } from 'react';
import { ThreeCanvas } from './components/ThreeCanvas';
import { Header } from './components/UI/Header';
import { SpeedometerHUD } from './components/UI/SpeedometerHUD';
import { Minimap } from './components/UI/Minimap';
import { MobileControls } from './components/UI/MobileControls';
import { ProjectModal } from './components/UI/ProjectModal';
import { AboutModal } from './components/UI/AboutModal';
import { ContactModal } from './components/UI/ContactModal';
import { ControlsHelpModal } from './components/UI/ControlsHelpModal';
import { CameraMode, ZoneInfo } from './types/portfolio';
import { sound } from './utils/soundEngine';
import { Smartphone, Monitor } from 'lucide-react';

export default function App() {
  // Config & Customization
  const [vehicleColor, setVehicleColor] = useState('#ea580c');
  const [isNightMode, setIsNightMode] = useState(true);
  const [cameraMode, setCameraMode] = useState<CameraMode>('chase');
  const [isMuted, setIsMuted] = useState(false);
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [isReelFrameView, setIsReelFrameView] = useState(false);

  // Modals & Navigation
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeZoneModal, setActiveZoneModal] = useState<'about' | 'contact' | null>(null);
  const [showControlsHelp, setShowControlsHelp] = useState(false);

  // Vehicle Telemetry
  const [speedKmh, setSpeedKmh] = useState(0);
  const [nitroFuel, setNitroFuel] = useState(100);
  const [gear, setGear] = useState('P');
  const [vehiclePos, setVehiclePos] = useState({ x: 0, z: 0, rot: 0 });

  // Interactive Signals
  const [teleportTarget, setTeleportTarget] = useState<{ x: number; z: number } | null>(null);
  const [resetBlocksSignal, setResetBlocksSignal] = useState(0);
  const [resetPinsSignal, setResetPinsSignal] = useState(0);

  // Unified Driving Input State
  const [inputState, setInputState] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    nitro: false,
    brake: false,
    horn: false
  });

  // Sound Mute Toggle
  const handleToggleMute = useCallback(() => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  }, []);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input inside a modal
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const code = e.code;
      if (code === 'KeyW' || code === 'ArrowUp') setInputState((s) => ({ ...s, forward: true }));
      if (code === 'KeyS' || code === 'ArrowDown') setInputState((s) => ({ ...s, backward: true }));
      if (code === 'KeyA' || code === 'ArrowLeft') setInputState((s) => ({ ...s, left: true }));
      if (code === 'KeyD' || code === 'ArrowRight') setInputState((s) => ({ ...s, right: true }));
      if (code === 'Space') {
        e.preventDefault();
        setInputState((s) => ({ ...s, brake: true }));
      }
      if (code === 'ShiftLeft' || code === 'ShiftRight' || code === 'KeyB') {
        setInputState((s) => ({ ...s, nitro: true }));
      }
      if (code === 'KeyH') {
        setInputState((s) => ({ ...s, horn: true }));
      }
      if (code === 'KeyR') {
        // Reset car to start
        setTeleportTarget({ x: 0, z: 0 });
        sound.playCollision(0.5);
      }
      if (code === 'KeyC') {
        // Cycle camera mode
        setCameraMode((prev) => (prev === 'chase' ? 'topdown' : prev === 'topdown' ? 'free' : 'chase'));
      }
      if (code === 'KeyN') {
        setIsNightMode((prev) => !prev);
      }
      if (code === 'Enter') {
        // Trigger modal for active zone
        if (activeZoneId === 'projects') setSelectedProjectId('3d-packaging-render');
        if (activeZoneId === 'about') setActiveZoneModal('about');
        if (activeZoneId === 'contact') setActiveZoneModal('contact');
      }
      if (code === 'Escape') {
        setSelectedProjectId(null);
        setActiveZoneModal(null);
        setShowControlsHelp(false);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const code = e.code;
      if (code === 'KeyW' || code === 'ArrowUp') setInputState((s) => ({ ...s, forward: false }));
      if (code === 'KeyS' || code === 'ArrowDown') setInputState((s) => ({ ...s, backward: false }));
      if (code === 'KeyA' || code === 'ArrowLeft') setInputState((s) => ({ ...s, left: false }));
      if (code === 'KeyD' || code === 'ArrowRight') setInputState((s) => ({ ...s, right: false }));
      if (code === 'Space') setInputState((s) => ({ ...s, brake: false }));
      if (code === 'ShiftLeft' || code === 'ShiftRight' || code === 'KeyB') {
        setInputState((s) => ({ ...s, nitro: false }));
      }
      if (code === 'KeyH') {
        setInputState((s) => ({ ...s, horn: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeZoneId]);

  // Touch / Mobile Input Dispatchers
  const handleTouchStart = (action: keyof typeof inputState) => {
    setInputState((s) => ({ ...s, [action]: true }));
  };

  const handleTouchEnd = (action: keyof typeof inputState) => {
    setInputState((s) => ({ ...s, [action]: false }));
  };

  // Teleport handler
  const handleTeleportToZone = (zone: ZoneInfo) => {
    setTeleportTarget({ x: zone.x, z: zone.z });
    sound.playSuccess();
  };

  // Open Zone Modal
  const handleOpenZoneModal = (zoneId: string) => {
    if (zoneId === 'projects') {
      setSelectedProjectId('3d-packaging-render');
    } else if (zoneId === 'about') {
      setActiveZoneModal('about');
    } else if (zoneId === 'contact') {
      setActiveZoneModal('contact');
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      {/* 3D WebGL Canvas Layer or Reel Phone Frame */}
      {isReelFrameView ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-2 sm:p-6 bg-radial from-slate-900 to-slate-950">
          {/* Reel Header Overlay */}
          <div className="text-center mb-3">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
              {language === 'bn' ? 'গ্রাফিক্স ডিজাইনার শাওন' : 'GRAPHICS DESIGNER SHAWON'}
            </h1>
            <p className="text-xs sm:text-sm text-cyan-400 font-semibold tracking-wider uppercase">
              {language === 'bn' ? '৩ডি পোর্টফোলিও · ব্র্যান্ডিং ও ভিজ্যুয়াল আর্ট' : '3D Portfolio · Branding & Visual Art'}
            </p>
          </div>

          {/* Smartphone Mockup Bezel */}
          <div className="relative w-full max-w-[420px] aspect-[9/19] bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700/80 ring-1 ring-cyan-500/50 overflow-hidden flex flex-col">
            {/* Camera notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full z-40" />

            <div className="relative w-full h-full rounded-[34px] overflow-hidden">
              <ThreeCanvas
                vehicleColor={vehicleColor}
                isNightMode={isNightMode}
                cameraMode={cameraMode}
                onZoneChange={setActiveZoneId}
                onOpenProject={(id) => setSelectedProjectId(id)}
                onOpenZoneModal={handleOpenZoneModal}
                onSpeedChange={(spd, nitro, gr) => {
                  setSpeedKmh(spd);
                  setNitroFuel(nitro);
                  setGear(gr);
                }}
                onVehicleStateUpdate={(x, z, rot) => setVehiclePos({ x, z, rot })}
                teleportTarget={teleportTarget}
                onTeleportComplete={() => setTeleportTarget(null)}
                resetBlocksSignal={resetBlocksSignal}
                resetPinsSignal={resetPinsSignal}
                inputState={inputState}
              />
            </div>
          </div>
        </div>
      ) : (
        <ThreeCanvas
          vehicleColor={vehicleColor}
          isNightMode={isNightMode}
          cameraMode={cameraMode}
          onZoneChange={setActiveZoneId}
          onOpenProject={(id) => setSelectedProjectId(id)}
          onOpenZoneModal={handleOpenZoneModal}
          onSpeedChange={(spd, nitro, gr) => {
            setSpeedKmh(spd);
            setNitroFuel(nitro);
            setGear(gr);
          }}
          onVehicleStateUpdate={(x, z, rot) => setVehiclePos({ x, z, rot })}
          teleportTarget={teleportTarget}
          onTeleportComplete={() => setTeleportTarget(null)}
          resetBlocksSignal={resetBlocksSignal}
          resetPinsSignal={resetPinsSignal}
          inputState={inputState}
        />
      )}

      {/* Primary Top Bar */}
      <Header
        isNightMode={isNightMode}
        onToggleNightMode={() => setIsNightMode(!isNightMode)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        cameraMode={cameraMode}
        onChangeCameraMode={setCameraMode}
        vehicleColor={vehicleColor}
        onChangeVehicleColor={setVehicleColor}
        language={language}
        onToggleLanguage={() => setLanguage((l) => (l === 'bn' ? 'en' : 'bn'))}
        onOpenControlsHelp={() => setShowControlsHelp(true)}
        onResetVehicle={() => {
          setTeleportTarget({ x: 0, z: 0 });
          sound.playCollision(0.5);
        }}
        onTeleportToZone={handleTeleportToZone}
        currentZoneId={activeZoneId}
      />

      {/* Floating View Mode Switcher: Fullscreen 3D vs Reel Video Frame */}
      <div className="fixed top-18 sm:top-20 left-4 z-20 pointer-events-auto select-none">
        <button
          onClick={() => setIsReelFrameView(!isReelFrameView)}
          title={isReelFrameView ? 'Switch to Fullscreen 3D' : 'Switch to Reel Video Mockup View'}
          className="px-2.5 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 backdrop-blur-md transition-colors flex items-center gap-1.5 text-xs shadow-lg"
        >
          {isReelFrameView ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">{language === 'bn' ? 'ফুল স্ক্রিন ৩ডি' : 'Full Immersion 3D'}</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">{language === 'bn' ? 'ভিডিও রিল ফ্রেম' : 'Reel Showcase Frame'}</span>
            </>
          )}
        </button>
      </div>

      {/* Speedometer & Zone Telemetry HUD */}
      <SpeedometerHUD
        speedKmh={speedKmh}
        nitroFuel={nitroFuel}
        gear={gear}
        activeZoneId={activeZoneId}
        language={language}
        onOpenZoneModal={handleOpenZoneModal}
        onResetBlocks={() => setResetBlocksSignal((s) => s + 1)}
        onResetPins={() => setResetPinsSignal((s) => s + 1)}
      />

      {/* Radar Minimap */}
      <Minimap
        vehicleX={vehiclePos.x}
        vehicleZ={vehiclePos.z}
        vehicleRotation={vehiclePos.rot}
        onTeleportToZone={handleTeleportToZone}
        language={language}
      />

      {/* Touch Screen & Mobile Driving Pedals */}
      <MobileControls
        onInputStart={handleTouchStart}
        onInputEnd={handleTouchEnd}
        onResetVehicle={() => setTeleportTarget({ x: 0, z: 0 })}
        language={language}
      />

      {/* Interactive Modals */}
      <ProjectModal
        projectId={selectedProjectId}
        onClose={() => setSelectedProjectId(null)}
        onSelectProject={(id) => setSelectedProjectId(id)}
        language={language}
      />

      <AboutModal
        isOpen={activeZoneModal === 'about'}
        onClose={() => setActiveZoneModal(null)}
        language={language}
      />

      <ContactModal
        isOpen={activeZoneModal === 'contact'}
        onClose={() => setActiveZoneModal(null)}
        language={language}
      />

      <ControlsHelpModal
        isOpen={showControlsHelp}
        onClose={() => setShowControlsHelp(false)}
        language={language}
      />
    </div>
  );
}
