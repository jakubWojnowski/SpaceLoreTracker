import { Injectable } from '@angular/core';
import { PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three-stdlib';
import { CameraMode, TargetObject } from './camera-mode.interface';
import { gsap } from 'gsap';

@Injectable()
export class FollowCameraMode implements CameraMode {
  private camera!: PerspectiveCamera;
  private controls!: OrbitControls;
  private followTarget?: TargetObject;
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
    this.controls.maxDistance = 20;
  }

  setTarget(target: Vector3, targetObject?: TargetObject): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.followTarget = targetObject;

    // Oblicz początkową odległość bazując na skali obiektu (2x średnica)
    const initialDistance = (targetObject?.scale || 1) * 4;
    
    // Oblicz nową pozycję kamery
    const currentDirection = new Vector3().subVectors(this.camera.position, this.controls.target).normalize();
    const newPosition = target.clone().add(currentDirection.multiplyScalar(initialDistance));

    // Animuj przejście punktu centralnego
    gsap.to(this.controls.target, {
      duration: 1.5,
      x: target.x,
      y: target.y,
      z: target.z,
      ease: "power2.inOut"
    });

    // Animuj przejście kamery do nowej pozycji
    gsap.to(this.camera.position, {
      duration: 1.5,
      x: newPosition.x,
      y: newPosition.y,
      z: newPosition.z,
      ease: "power2.inOut",
      onComplete: () => {
        this.isTransitioning = false;
      }
    });
  }

  update(): void {
    if (!this.controls || !this.followTarget) return;

    if (!this.isTransitioning) {
      this.controls.target.copy(this.followTarget.position);
    }
    
    this.controls.update();
  }

  cleanup(): void {
    this.followTarget = undefined;
    this.isTransitioning = false;
  }
} 