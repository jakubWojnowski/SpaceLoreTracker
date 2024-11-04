import { Injectable } from '@angular/core';
import { PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three-stdlib';
import { CameraMode } from './camera-mode.interface';
import { gsap } from 'gsap';

@Injectable()
export class FollowCameraMode implements CameraMode {
  private camera!: PerspectiveCamera;
  private controls!: OrbitControls;
  private followTarget?: { position: Vector3 };
  private isTransitioning: boolean = false;

  initialize(camera: PerspectiveCamera, controls: OrbitControls): void {
    this.camera = camera;
    this.controls = controls;
    
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.rotateSpeed = 0.3;
    this.controls.zoomSpeed = 0.3;
    this.controls.enablePan = false;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 10;
  }

  setTarget(target: Vector3, targetObject?: { position: Vector3 }): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.followTarget = targetObject;

    // Animuj tylko punkt centralny kontrolek
    gsap.to(this.controls.target, {
      duration: 1.5,
      x: target.x,
      y: target.y,
      z: target.z,
      ease: "power2.inOut",
      onComplete: () => {
        this.isTransitioning = false;
      }
    });
  }

  update(): void {
    if (!this.controls || !this.followTarget) return;

    if (!this.isTransitioning) {
      // Aktualizuj tylko punkt centralny kontrolek
      this.controls.target.copy(this.followTarget.position);
    }
    
    this.controls.update();
  }

  cleanup(): void {
    this.followTarget = undefined;
    this.isTransitioning = false;
  }
} 