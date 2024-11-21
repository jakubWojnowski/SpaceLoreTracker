import { Vector3 } from 'three';
import { OrbitControls } from 'three-stdlib';import * as THREE from 'three';


export interface OrbitParameters {


  semiMajorAxis: number;
  eccentricity: number;
  inclination: number;
  ascendingNode: number;
  argumentOfPeriapsis: number;
  center?: THREE.Vector3;
}

export interface IOrbitalPath {
  calculatePosition(time: number): THREE.Vector3;
  getPathPoints(segments: number): THREE.Vector3[];
  getParameters(): OrbitParameters;
}
