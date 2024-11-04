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
  private lastCameraPosition: Vector3 = new Vector3();
  private lastCameraOffset: Vector3 = new Vector3();
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

    // Zachowaj aktualną pozycję kamery
    this.lastCameraPosition.copy(this.camera.position);
    
    // Oblicz offset względem nowego celu
    this.lastCameraOffset.copy(this.camera.position.clone().sub(this.controls.target));

    // Animuj przejście do nowej pozycji
    gsap.to(this.controls.target, {
      duration: 2,
      x: target.x,
      y: target.y,
      z: target.z,
      ease: "power2.inOut"
    });

    const newPosition = target.clone().add(this.lastCameraOffset);
    gsap.to(this.camera.position, {
      duration: 2,
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
    if (!this.controls || !this.followTarget || this.isTransitioning) return;

    // Aktualizuj pozycję celu kontrolek
    this.controls.target.copy(this.followTarget.position);
    
    // Aktualizuj pozycję kamery zachowując względny offset
    const newPosition = this.followTarget.position.clone().add(this.lastCameraOffset);
    this.camera.position.lerp(newPosition, 0.1);
    
    this.controls.update();
  }

  cleanup(): void {
    this.followTarget = undefined;
    this.isTransitioning = false;
  }
} 