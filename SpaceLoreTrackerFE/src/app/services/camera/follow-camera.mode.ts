import { Injectable } from '@angular/core';
import { PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three-stdlib';
import { CameraMode, TargetObject, CameraState } from './camera-mode.interface';
import { gsap } from 'gsap';

@Injectable()
export class FollowCameraMode implements CameraMode {
  private camera!: PerspectiveCamera;
  private controls!: OrbitControls;
  private followTarget?: TargetObject;
  private isTransitioning: boolean = false;
  private currentDistance: number = 0;

  initialize(camera: PerspectiveCamera, controls: OrbitControls, state?: CameraState): void {
    this.camera = camera;
    this.controls = controls;
    
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.rotateSpeed = 0.3;
    this.controls.zoomSpeed = 0.3;
    this.controls.enablePan = false;
    this.controls.minDistance = 0.5;
    this.controls.maxDistance = 50;

    if (state) {
      this.camera.position.copy(state.lastPosition);
      this.controls.target.copy(state.lastTarget);
      this.currentDistance = this.camera.position.distanceTo(this.controls.target);
    }
  }

  setTarget(target: Vector3, targetObject?: TargetObject, state?: CameraState): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.followTarget = targetObject;

    // Oblicz początkową odległość bazując na skali obiektu (2x średnica)
    const initialDistance = (targetObject?.scale || 1) * 4;
    this.currentDistance = initialDistance;
    
    // Użyj ostatniej pozycji kamery jeśli jest dostępna
    const startPosition = state?.lastPosition || this.camera.position;
    const currentDirection = new Vector3().subVectors(startPosition, state?.lastTarget || this.controls.target).normalize();
    const newPosition = target.clone().add(currentDirection.multiplyScalar(this.currentDistance));

    // Animuj przejście punktu centralnego i kamery
    gsap.to(this.controls.target, {
      duration: 1.5,
      x: target.x,
      y: target.y,
      z: target.z,
      ease: "power2.inOut"
    });

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
      const currentDirection = new Vector3().subVectors(this.camera.position, this.controls.target).normalize();
      this.currentDistance = this.camera.position.distanceTo(this.controls.target);
      
      this.controls.target.copy(this.followTarget.position);
      
      const newPosition = this.followTarget.position.clone().add(currentDirection.multiplyScalar(this.currentDistance));
      this.camera.position.copy(newPosition);
    }
    
    this.controls.update();
  }

  cleanup(): void {
    this.followTarget = undefined;
    this.isTransitioning = false;
  }
} 