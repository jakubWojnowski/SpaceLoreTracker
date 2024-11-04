import { Injectable } from '@angular/core';
import { Vector3, PerspectiveCamera } from 'three';
import { OrbitControls } from 'three-stdlib';
import { FreeCameraMode } from './camera/free-camera.mode';
import { FollowCameraMode } from './camera/follow-camera.mode';
import { CameraMode, CameraModeType, TargetObject } from './camera/camera-mode.interface';

@Injectable()
export class CameraService {
  private camera!: PerspectiveCamera;
  private controls!: OrbitControls;
  private currentMode!: CameraMode;
  private modes: Map<CameraModeType, CameraMode>;

  constructor() {
    const modesArray: [CameraModeType, CameraMode][] = [
      [CameraModeType.FREE, new FreeCameraMode()],
      [CameraModeType.FOLLOW, new FollowCameraMode()]
    ];
    
    this.modes = new Map<CameraModeType, CameraMode>(modesArray);
    this.currentMode = this.modes.get(CameraModeType.FREE)!;
  }

  initialize(store: any): void {
    this.camera = store.get('camera') as PerspectiveCamera;
    const renderer = store.get('gl');
    this.controls = new OrbitControls(this.camera, renderer.domElement);
    
    this.currentMode.initialize(this.camera, this.controls);
  }

  setMode(mode: CameraModeType, target?: Vector3, targetObject?: TargetObject): void {
    this.currentMode.cleanup();
    this.currentMode = this.modes.get(mode)!;
    this.currentMode.initialize(this.camera, this.controls);
    
    if (mode === CameraModeType.FOLLOW && target) {
      (this.currentMode as FollowCameraMode).setTarget(target, targetObject);
    }
  }

  update(): void {
    this.currentMode.update();
  }
}
