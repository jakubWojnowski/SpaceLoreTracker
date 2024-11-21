import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgtCanvas, extend, NgtThreeEvent } from 'angular-three';
import * as THREE from 'three';

extend(THREE);

@Component({
  selector: 'app-orbit',
  standalone: true,
  imports: [NgtCanvas],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ngt-mesh
      [visible]="visible"
      (pointerover)="onPointerOver()"
      (pointerout)="onPointerOut()" 
      (pointerdown)="onMeshClick($event)">
      <ngt-buffer-geometry [attributes]="geometryAttributes"></ngt-buffer-geometry>
      <ngt-line-basic-material
        [transparent]="true"
        [opacity]="opacity"
        [color]="currentColor">
      </ngt-line-basic-material>
    </ngt-mesh>
  `
})
export class OrbitComponent implements OnInit, OnChanges {
  @Input() radius: number = 1;
  @Input() color: string = 'white';
  @Input() visible: boolean = true;
  @Output() click = new EventEmitter<void>();

  opacity = 0.5;
  currentColor!: THREE.Color;
  originalColor!: THREE.Color;
  geometryAttributes: Record<string, THREE.BufferAttribute> = {};

  ngOnInit() {
    this.originalColor = new THREE.Color(this.color);
    this.currentColor = this.originalColor.clone();
    this.updateOrbit();
  }

  updateOrbit() {
    const segments = 128;
    const points = [];

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(
        Math.cos(theta) * this.radius,
        0,
        Math.sin(theta) * this.radius
      );
    }

    this.geometryAttributes['position'] = new THREE.Float32BufferAttribute(points, 3);
  }

  onPointerOver() {
    this.opacity = 1;
    this.currentColor.setRGB(
      this.originalColor.r * 1.5,
      this.originalColor.g * 1.5,
      this.originalColor.b * 1.5
    );
  }

  onPointerOut() {
    this.opacity = 0.5;
    this.currentColor.copy(this.originalColor);
  }

  onMeshClick(event: NgtThreeEvent<PointerEvent>) {
    event.stopPropagation();
    this.click.emit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['radius']) {
      this.updateOrbit();
    }
    if (changes['color'] && this.originalColor && this.currentColor) {
      this.originalColor.set(this.color);
      this.currentColor.copy(this.originalColor);
    }
  }
}
