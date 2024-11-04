import { Vector3, PerspectiveCamera } from 'three';
import { OrbitControls } from 'three-stdlib';

export interface TargetObject {
  position: Vector3;
  scale?: number;
}

export interface CameraState {
  lastPosition: Vector3;
  lastTarget: Vector3;
}

export interface CameraMode {
  initialize(camera: PerspectiveCamera, controls: OrbitControls, state?: CameraState): void;
  update(): void;
  setTarget?(target: Vector3, targetObject?: TargetObject, state?: CameraState): void;
  cleanup(): void;
}

export enum CameraModeType {
  FREE = 'FREE',
  FOLLOW = 'FOLLOW'
} 