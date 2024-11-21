import { Vector3 } from 'three';
import { OrbitParameters, IOrbitalPath } from './orbit.interface';

export abstract class AbstractOrbit implements IOrbitalPath {
  protected parameters: OrbitParameters;
  
  constructor(parameters: OrbitParameters) {
    this.parameters = {
      ...parameters,
      center: parameters.center || new Vector3(0, 0, 0)
    };
  }

  abstract calculatePosition(time: number): Vector3;
  
  abstract getPathPoints(segments: number): Vector3[];
  
  getParameters(): OrbitParameters {
    return this.parameters;
  }
  
  protected rotateVector(vector: Vector3): Vector3 {
    const { inclination, ascendingNode, argumentOfPeriapsis } = this.parameters;
    
    vector.applyAxisAngle(new Vector3(1, 0, 0), inclination);
    vector.applyAxisAngle(new Vector3(0, 1, 0), ascendingNode);
    vector.applyAxisAngle(new Vector3(0, 0, 1), argumentOfPeriapsis);
    
    return vector;
  }
}
