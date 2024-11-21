import { Vector3 } from 'three';
import { AbstractOrbit } from './abstract-orbit';

export class EllipticalOrbit extends AbstractOrbit {
  calculatePosition(time: number): Vector3 {
    const { semiMajorAxis, eccentricity, center } = this.parameters;
    
    // Obliczanie pozycji na elipsie używając równań Keplera
    const angle = time * Math.PI * 2;
    const r = semiMajorAxis * (1 - eccentricity * eccentricity) / 
              (1 + eccentricity * Math.cos(angle));
    
    const position = new Vector3(
      r * Math.cos(angle),
      0,
      r * Math.sin(angle)
    );
    
    // Zastosowanie rotacji i przesunięcia
    this.rotateVector(position);
    position.add(center!);
    
    return position;
  }

  getPathPoints(segments: number): Vector3[] {
    const points: Vector3[] = [];
    
    for (let i = 0; i <= segments; i++) {
      const time = i / segments;
      points.push(this.calculatePosition(time));
    }
    
    return points;
  }
}
