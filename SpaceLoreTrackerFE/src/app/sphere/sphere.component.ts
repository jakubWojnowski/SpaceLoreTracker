import {Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnChanges, SimpleChanges} from '@angular/core';
import {NgtCanvas, extend, NgtBeforeRenderEvent} from 'angular-three';
import * as THREE from 'three';

extend(THREE);

@Component({
  selector: 'app-sphere',
  standalone: true,
  imports: [NgtCanvas],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './sphere.component.html',
})
export class SphereComponent implements OnChanges {
  @Input() position: [number, number, number] = [0, 0, 0];
  @Input() scale: number = 1;
  @Input() color: string = 'hotpink';
  @Input() name: string = '';
  @Input() rotationSpeed: number = 0.01;

  mesh?: THREE.Mesh;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['position'] && this.mesh) {
      const [x, y, z] = this.position;
      this.mesh.position.set(x, y, z);
    }
    if (changes['scale'] && this.mesh) {
      this.mesh.scale.setScalar(this.scale);
    }
  }

  onBeforeRender(event: NgtBeforeRenderEvent<THREE.Mesh>) {
    if (!this.mesh) {
      this.mesh = event.object;
    }
    this.mesh.rotation.y += this.rotationSpeed;
  }
}
