import {Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit} from '@angular/core';
import {extend, NgtBeforeRenderEvent, NgtCanvas} from 'angular-three';
import {NgtArgs} from "angular-three";
import * as THREE from 'three';
extend(THREE);
@Component({
  selector: 'app-cube',
  standalone: true,
  imports: [
    NgtArgs,
    NgtCanvas,

  ],
  templateUrl: './cube.component.html',
  styleUrl: './cube.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class Cube {
  active = false;
  hovered = false;
  @Input() position = [0, 0, 0];

  onBeforeRender(event: NgtBeforeRenderEvent<THREE.Mesh>) {
    event.object.rotation.x += 0.01;
  }
}
