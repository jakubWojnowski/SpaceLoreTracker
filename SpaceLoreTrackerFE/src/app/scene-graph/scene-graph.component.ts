import {Component, CUSTOM_ELEMENTS_SCHEMA, inject, ViewChildren, QueryList, ElementRef, ChangeDetectorRef, OnInit, AfterViewInit} from '@angular/core';
import {NgtCanvas, extend, NgtBeforeRenderEvent, NgtArgs, NGT_STORE, NgtRenderState} from 'angular-three';
import { OrbitControls } from 'three-stdlib';import * as THREE from 'three';
import {Cube} from "../cube/cube.component";
import {SphereComponent} from "../sphere/sphere.component";
import {NgForOf} from "@angular/common";
import { OrbitComponent } from "../orbit/orbit.component";
extend(THREE);
extend({ OrbitControls });
interface Planet {
  name: string;
  position: THREE.Vector3;
  radius: number;
  color: string;
  rotationSpeed: number;
  orbitRadius: number;
  orbitColor: string;
  orbitSpeed: number;
  currentAngle: number;
}
@Component({
  selector: 'app-scene-graph',
  standalone: true,
  imports: [Cube, NgtArgs, SphereComponent, NgForOf, OrbitComponent],


  templateUrl: './scene-graph.component.html',
  styleUrl: './scene-graph.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class SceneGraphComponent implements OnInit, AfterViewInit {
  constructor(private cdr: ChangeDetectorRef, ) {}

   store = inject(NGT_STORE);

  readonly camera = this.store.get('camera');
  readonly glDom = this.store.get('gl', 'domElement');

  planets: Planet[] = [
    { name: 'Słońce', position: new THREE.Vector3(0, 0, 0), radius: 2, color: 'yellow', rotationSpeed: 0.001, orbitRadius: 0, orbitColor: 'transparent', orbitSpeed: 0, currentAngle: 0 },
    { name: 'Merkury', position: new THREE.Vector3(3, 0, 0), radius: 0.4, color: 'gray', rotationSpeed: 0.02, orbitRadius: 3, orbitColor: 'lightgray', orbitSpeed: 0.005, currentAngle: 0 },
    { name: 'Wenus', position: new THREE.Vector3(5, 0, 0), radius: 0.9, color: 'orange', rotationSpeed: 0.015, orbitRadius: 5, orbitColor: 'lightyellow', orbitSpeed: 0.004, currentAngle: 0 },
    { name: 'Ziemia', position: new THREE.Vector3(7, 0, 0), radius: 1, color: 'blue', rotationSpeed: 0.01, orbitRadius: 7, orbitColor: 'lightblue', orbitSpeed: 0.003, currentAngle: 0 },
    { name: 'Mars', position: new THREE.Vector3(9, 0, 0), radius: 0.5, color: 'red', rotationSpeed: 0.008, orbitRadius: 9, orbitColor: 'pink', orbitSpeed: 0.002, currentAngle: 0 },
    { name: 'Jowisz', position: new THREE.Vector3(12, 0, 0), radius: 1.8, color: 'brown', rotationSpeed: 0.005, orbitRadius: 12, orbitColor: 'tan', orbitSpeed: 0.001, currentAngle: 0 },
  ];

  ngOnInit() {
    this.updatePlanetPositions(0);
  }

  ngAfterViewInit() {
    const scene = this.store.get('scene');
    scene.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
      this.updatePlanetPositions(0.016); // Zakładamy 60 FPS, więc delta to około 1/60
    };
  }

  updatePlanetPositions(delta: number) {
    this.planets.forEach((planet, index) => {
      if (index === 0) return; // Pomijamy Słońce
      planet.currentAngle += planet.orbitSpeed * delta;
      const x = Math.cos(planet.currentAngle) * planet.orbitRadius;
      const z = Math.sin(planet.currentAngle) * planet.orbitRadius;
      planet.position.set(x, 0, z);
    });
    this.cdr.detectChanges();
  }
}