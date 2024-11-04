import { Injectable } from '@angular/core';
import { Vector3 } from 'three';
import { OrbitControls } from 'three-stdlib';
import { gsap } from 'gsap';
import { NGT_STORE } from 'angular-three';

@Injectable()
export class CameraService {
  private controls: OrbitControls | null = null;
  private store: any;
  private camera: any;

  constructor() {}

  initialize(store: any) {
    this.store = store;
    this.camera = store.get('camera');
  }

  initializeControls() {
    if (!this.store) return;
    
    const renderer = this.store.get('gl');
    this.controls = new OrbitControls(this.camera, renderer.domElement);
    this.setupControls();
    this.setupAnimationLoop(renderer);
  }

  private setupControls() {
    if (!this.controls) return;
    
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.rotateSpeed = 0.5;
    this.controls.zoomSpeed = 0.5;
    this.controls.panSpeed = 0.5;
  }

  private setupAnimationLoop(renderer: any) {
    const scene = this.store.get('scene');
    renderer.setAnimationLoop(() => {
      if (this.controls) {
        this.controls.update();
      }
      renderer.render(scene, this.camera);
    });
  }

  moveCameraToPosition(targetPosition: Vector3, lookAtPosition: Vector3) {
    if (!this.controls || !this.camera) return;

    gsap.to(this.camera.position, {
      duration: 2,
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      onUpdate: () => {
        this.camera.lookAt(lookAtPosition);
      }
    });

    gsap.to(this.controls.target, {
      duration: 2,
      x: lookAtPosition.x,
      y: lookAtPosition.y,
      z: lookAtPosition.z,
      onComplete: () => {
        if (this.controls) {
          this.controls.update();
        }
      }
    });
  }
}
