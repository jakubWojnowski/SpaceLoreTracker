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
  @Input() radius: number = 1; // Dodano możliwość ustawienia promienia
  @Input() color: string = 'hotpink';
  @Input() name: string = '';
  @Input() rotationSpeed: number = 0.01;

  mesh?: THREE.Mesh;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['position'] && this.mesh) {
      const [x, y, z] = this.position;
      this.mesh.position.set(x, y, z);
    }
    if (changes['radius'] && this.mesh) {
      console.log('Radius changed:', this.radius); // Dodaj log, aby zobaczyć przekazywany promień
      const geometry = new THREE.SphereGeometry(this.radius, 32, 32); // Tworzenie geometrii z odpowiednim promieniem
      this.mesh.geometry.dispose(); // Zwolnij pamięć starej geometrii
      this.mesh.geometry = geometry; // Ustaw nową geometrię
    }
  }

  onBeforeRender(event: NgtBeforeRenderEvent<THREE.Mesh>) {
    if (!this.mesh) {
      this.mesh = event.object;
    }
    this.mesh.rotation.y += this.rotationSpeed;
  }
}
