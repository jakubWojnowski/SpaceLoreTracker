import { Injectable } from '@angular/core';
import { Vector3, PerspectiveCamera } from 'three';
import { OrbitControls } from 'three-stdlib';
import { FreeCameraMode } from './camera/free-camera.mode';
import { FollowCameraMode } from './camera/follow-camera.mode';
import { CameraMode, CameraModeType, TargetObject, CameraState } from './camera/camera-mode.interface';

@Injectable()
export class CameraService {
  private camera!: PerspectiveCamera;
  private controls!: OrbitControls;
  private currentMode!: CameraMode;
  private modes: Map<CameraModeType, CameraMode>;
  private lastCameraPosition: Vector3 = new Vector3();
  private lastCameraTarget: Vector3 = new Vector3();

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
    
    this.lastCameraPosition.copy(this.camera.position);
    this.lastCameraTarget.copy(this.controls.target);
    
    this.currentMode.initialize(this.camera, this.controls);
  }

  setMode(mode: CameraModeType, target?: Vector3, targetObject?: TargetObject): void {
    const cameraState: CameraState = {
      lastPosition: this.camera.position.clone(),
      lastTarget: this.controls.target.clone()
    };

    this.currentMode.cleanup();
    this.currentMode = this.modes.get(mode)!;
    
    if (mode === CameraModeType.FOLLOW && target) {
      this.currentMode.initialize(this.camera, this.controls);
      (this.currentMode as FollowCameraMode).setTarget(target, targetObject, cameraState);
    } else {
      this.currentMode.initialize(this.camera, this.controls, cameraState);
    }
  }

  update(): void {
    this.currentMode.update();
  }
}
