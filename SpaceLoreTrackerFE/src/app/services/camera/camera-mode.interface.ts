import { Vector3, PerspectiveCamera } from 'three';
import { OrbitControls } from 'three-stdlib';

export interface CameraMode {
  initialize(camera: PerspectiveCamera, controls: OrbitControls): void;
  update(): void;
  setTarget?(target: Vector3): void;
  cleanup(): void;
}

export enum CameraModeType {
  FREE = 'FREE',
  FOLLOW = 'FOLLOW'
} 