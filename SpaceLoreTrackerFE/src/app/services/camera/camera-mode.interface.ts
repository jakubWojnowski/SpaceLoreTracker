import { Vector3, PerspectiveCamera } from 'three';
import { OrbitControls } from 'three-stdlib';

export interface TargetObject {
  position: Vector3;
  scale?: number;
}

export interface CameraMode {
  initialize(camera: PerspectiveCamera, controls: OrbitControls): void;
  update(): void;
  setTarget?(target: Vector3, targetObject?: TargetObject): void;
  cleanup(): void;
}

export enum CameraModeType {
  FREE = 'FREE',
  FOLLOW = 'FOLLOW'
} 