import {Component, CUSTOM_ELEMENTS_SCHEMA, inject, ViewChildren, QueryList, ElementRef, ChangeDetectorRef, OnInit, AfterViewInit} from '@angular/core';
import {NgtCanvas, extend, NgtBeforeRenderEvent, NgtArgs, NGT_STORE, NgtRenderState} from 'angular-three';
import { OrbitControls } from 'three-stdlib';import * as THREE from 'three';
import {Cube} from "../cube/cube.component";
import {SphereComponent} from "../sphere/sphere.component";
import {NgForOf} from "@angular/common";
import { OrbitComponent } from "../orbit/orbit.component";
import { TextureLoader } from 'three';

extend(THREE);
extend({ OrbitControls });

interface Planet {
  name: string;
  position: THREE.Vector3;
  scale: number;
  color?: string;
  rotationSpeed: number;
  orbitRadius: number;
  orbitColor: string;
  orbitSpeed: number;
  currentAngle: number;
  texturePath: string; // Dodaj pole texturePath
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
toggleOrbits() {
  this.showOrbits = !this.showOrbits;
  this.cdr.detectChanges();
}
  constructor(private cdr: ChangeDetectorRef, ) {}

   store = inject(NGT_STORE);

  readonly camera = this.store.get('camera');
  readonly glDom = this.store.get('gl', 'domElement');

  planets: Planet[] = [
    { name: 'Słońce', position: new THREE.Vector3(0, 0, 0), scale: 1.5, rotationSpeed: 0.001, orbitRadius: 0, orbitColor: 'transparent', orbitSpeed: 0, currentAngle: 0, texturePath: '8k_sun.jpg' },
    { name: 'Merkury', position: new THREE.Vector3(3, 0, 0), scale: 0.1, rotationSpeed: 0.02, orbitRadius: 3, orbitColor: 'lightgray', orbitSpeed: 0.060, currentAngle: 5, texturePath: '8k_mercury.jpg' },
    { name: 'Wenus', position: new THREE.Vector3(5, 0, 0), scale: 0.1, rotationSpeed: 0.015, orbitRadius: 5, orbitColor: 'lightyellow', orbitSpeed: 0.048, currentAngle: 2, texturePath: '8k_venus_surface.jpg' },
    { name: 'Ziemia', position: new THREE.Vector3(7, 0, 0), scale: 0.2, rotationSpeed: 0.01, orbitRadius: 7, orbitColor: 'lightblue', orbitSpeed: 0.036, currentAngle: 3, texturePath: '8k_earth_daymap.jpg' },
    { name: 'Mars', position: new THREE.Vector3(9, 0, 0), scale: 0.1, rotationSpeed: 0.008, orbitRadius: 9, orbitColor: 'pink', orbitSpeed: 0.024, currentAngle: 4, texturePath: '8k_mars.jpg' },
    { name: 'Jowisz', position: new THREE.Vector3(12, 0, 0), scale: 0.3, rotationSpeed: 0.005, orbitRadius: 12, orbitColor: 'tan', orbitSpeed: 0.012, currentAngle: 9, texturePath: '8k_jupiter.jpg' },
    { name: 'Saturn', position: new THREE.Vector3(15, 0, 0), scale: 0.3, rotationSpeed: 0.004, orbitRadius: 15, orbitColor: 'khaki', orbitSpeed: 0.009, currentAngle: 10, texturePath: '8k_saturn.jpg' },
    { name: 'Uran', position: new THREE.Vector3(18, 0, 0), scale: 0.1, rotationSpeed: 0.003, orbitRadius: 18, orbitColor: 'powderblue', orbitSpeed: 0.006, currentAngle: 11, texturePath: '2k_uranus.jpg' },
    { name: 'Neptun', position: new THREE.Vector3(21, 0, 0), scale: 0.1, rotationSpeed: 0.002, orbitRadius: 21, orbitColor: 'royalblue', orbitSpeed: 0.003, currentAngle: 12, texturePath: '2k_neptune.jpg' }
  ];

  showOrbits: boolean = true;

  ngOnInit() {
    this.updatePlanetPositions(0);
  }

  ngAfterViewInit() {
    const scene = this.store.get('scene');
    scene.background = new THREE.Color('black');
    this.planets.forEach(planet => {
      // const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshStandardMaterial({ color: planet.color }));
      // sphere.scale.setScalar(planet.scale);
      // sphere.position.copy(planet.position);
      // scene.add(sphere);
      //
      // if (this.showOrbits) {
      //   const orbit = new THREE.Line(new THREE.CircleGeometry(planet.orbitRadius, 64), new THREE.LineBasicMaterial({ color: planet.orbitColor }));
      //   orbit.rotation.x = Math.PI / 2;
      //   scene.add(orbit);
      // }

    });


    const textureLoader = new TextureLoader();
    textureLoader.load('8k_stars.jpg', (texture) => {
      scene.background = texture;
    });

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
