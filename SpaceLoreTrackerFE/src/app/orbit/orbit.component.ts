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
        [linewidth]="2"
        [color]="color">
      </ngt-line-basic-material>
    </ngt-mesh>
  `
})
export class OrbitComponent implements OnInit {
  @Input() radius: number = 10;
  @Input() color: string = 'red';
  @Input() visible: boolean = true;
  @Output() click = new EventEmitter<void>();

  opacity: number = 0.5;
  geometryAttributes: any;

  ngOnInit() {
    const segments = 128;
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * this.radius;
      const z = Math.sin(angle) * this.radius;
      points.push(new THREE.Vector3(x, 0, z));
    }

    const positions = new Float32Array(points.length * 3);
    points.forEach((point, i) => {
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
    });

    this.geometryAttributes = {
      position: new THREE.BufferAttribute(positions, 3)
    };
  }

  onPointerOver() {
    this.opacity = 1.0;
  }

  onPointerOut() {
    this.opacity = 0.5;
  }

  onMeshClick(event: NgtThreeEvent<PointerEvent>) {
    event.stopPropagation();
    this.click.emit();
  }
}
