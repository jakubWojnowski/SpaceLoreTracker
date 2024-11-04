import { Injectable } from '@angular/core';
import { PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three-stdlib';
import { CameraMode } from './camera-mode.interface';

@Injectable()
export class FreeCameraMode implements CameraMode {
  private camera!: PerspectiveCamera;
  private controls!: OrbitControls;

  initialize(camera: PerspectiveCamera, controls: OrbitControls): void {
    this.camera = camera;
    this.controls = controls;
    
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.rotateSpeed = 0.5;
    this.controls.zoomSpeed = 0.5;
    this.controls.panSpeed = 0.5;
    this.controls.enablePan = true;
  }

  update(): void {
    if (this.controls) {
      this.controls.update();
    }
  }

  cleanup(): void {
    // Reset do domyślnych ustawień
    if (this.controls) {
      this.controls.reset();
    }
  }
} 