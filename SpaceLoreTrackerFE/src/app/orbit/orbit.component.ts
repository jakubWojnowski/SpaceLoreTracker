import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { NgtCanvas, extend } from 'angular-three';
import * as THREE from 'three';

extend(THREE);

@Component({
  selector: 'app-orbit',
  standalone: true,
  imports: [NgtCanvas],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './orbit.component.html',
})
export class OrbitComponent implements OnInit, OnChanges {
  @Input() radius: number = 1;
  @Input() color: string = 'white';
  @Input() visible: boolean = true;
  @Output() click = new EventEmitter<void>();

  geometry!: THREE.BufferGeometry;
  material!: THREE.LineBasicMaterial;

  ngOnInit() {
    this.material = new THREE.LineBasicMaterial({ color: this.color });
    this.updateOrbit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['radius'] || changes['color']) {
      this.updateOrbit();
    }
    if (changes['color'] && this.material) {
      this.material.color = new THREE.Color(this.color);
    }
  }

  updateOrbit() {
    const segments = 64;
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(
        Math.cos(theta) * this.radius,
        0,
        Math.sin(theta) * this.radius
      ));
    }
    
    this.geometry = new THREE.BufferGeometry().setFromPoints(points);
  }

  onClick() {
    this.click.emit();
  }
}
