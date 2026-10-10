export interface Project {
  id: string;
  title: string;
  titleBn: string;
  tagline: string;
  taglineBn: string;
  category: 'Logo & Branding' | '3D Packaging' | 'Social Media Ads' | 'Print & Editorial' | 'Visual Art';
  description: string;
  descriptionBn: string;
  tags: string[];
  metrics?: string;
  githubUrl: string;
  liveUrl: string;
  color: string;
  highlights: string[];
  highlightsBn: string[];
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Adobe Creative Suite' | '3D & Motion' | 'Branding & Vector' | 'Print & Media';
  level: number;
  color: string;
  textColor?: string;
}

export interface ZoneInfo {
  id: 'start' | 'projects' | 'skills' | 'playground' | 'about' | 'contact';
  name: string;
  nameBn: string;
  x: number;
  z: number;
  radius: number;
  color: string;
  description: string;
  descriptionBn: string;
}

export type CameraMode = 'chase' | 'topdown' | 'free';

export interface VehiclePhysicsState {
  x: number;
  y: number;
  z: number;
  rotationY: number;
  speed: number;
  steerAngle: number;
  isGrounded: boolean;
  isNitro: boolean;
  nitroFuel: number;
  pitch: number;
  roll: number;
  verticalVelocity: number;
}
