import { Injectable } from '@angular/core';
import { PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three-stdlib';
import { CameraMode, CameraState } from './camera-mode.interface';

@Injectable()
export class FreeCameraMode implements CameraMode {
  private camera!: PerspectiveCamera;
  private controls!: OrbitControls;

  initialize(camera: PerspectiveCamera, controls: OrbitControls, state?: CameraState): void {
    this.camera = camera;
    this.controls = controls;
    
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.rotateSpeed = 0.5;
    this.controls.zoomSpeed = 0.5;
    this.controls.panSpeed = 0.5;
    this.controls.enablePan = true;
    this.controls.minDistance = 0.5;
    this.controls.maxDistance = 100;

    if (state) {
      this.camera.position.copy(state.lastPosition);
      this.controls.target.copy(state.lastTarget);
    }
  }

  update(): void {
    if (this.controls) {
      this.controls.update();
    }
  }

  cleanup(): void {
  }
} 