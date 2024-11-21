import {Component, CUSTOM_ELEMENTS_SCHEMA, inject, ViewChildren, QueryList, ElementRef, ChangeDetectorRef, OnInit, AfterViewInit, HostListener} from '@angular/core';
import {NgtCanvas, extend, NgtBeforeRenderEvent, NgtArgs, NGT_STORE, NgtRenderState} from 'angular-three';
import { OrbitControls } from 'three-stdlib';import * as THREE from 'three';
import {Cube} from "../cube/cube.component";
import {SphereComponent} from "../sphere/sphere.component";
import {NgForOf} from "@angular/common";
import { OrbitComponent } from "../orbit/orbit.component";
import { TextureLoader } from 'three';
import { Vector3 } from 'three';
import { gsap } from 'gsap';
import { CameraService } from '../services/camera.service';
import { CameraModeType } from '../services/camera/camera-mode.interface';

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
  providers: [CameraService]

})
export class SceneGraphComponent implements OnInit, AfterViewInit {
  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    this.toggleFreeCamera();
  }

  toggleOrbits() {
    this.showOrbits = !this.showOrbits;
    this.cdr.detectChanges();
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private cameraService: CameraService
  ) {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.toggleFreeCamera();
      }
    });
  }

   store = inject(NGT_STORE);

   planets: Planet[] = [
    { 
        name: 'Słońce',
        position: new THREE.Vector3(0, 0, 0),
        scale: 109.0, // Promień Słońca w stosunku do Ziemi
        rotationSpeed: 0.0007, // Rotacja Słońca (dni na obrót w sekundach)
        orbitRadius: 0,
        orbitColor: 'transparent',
        orbitSpeed: 0,
        currentAngle: 0,
        texturePath: '8k_sun.jpg'
    },
    { 
        name: 'Merkury',
        position: new THREE.Vector3(57.9, 0, 0),
        scale: 0.383, // Promień Merkurego względem Ziemi
        rotationSpeed: 0.017, // Rotacja planety (obrót w dniach/sekundach)
        orbitRadius: 57.9, // Średnia odległość od Słońca w mln km
        orbitColor: 'lightgray',
        orbitSpeed: 0.0474, // Prędkość orbitalna (AU/rok)
        currentAngle: Math.random() * Math.PI * 2,
        texturePath: '8k_mercury.jpg'
    },
    { 
        name: 'Wenus',
        position: new THREE.Vector3(108.2, 0, 0),
        scale: 0.949,
        rotationSpeed: -0.0041, // Rotacja wsteczna
        orbitRadius: 108.2,
        orbitColor: 'lightyellow',
        orbitSpeed: 0.035,
        currentAngle: Math.random() * Math.PI * 2,
        texturePath: '8k_venus_surface.jpg'
    },
    { 
        name: 'Ziemia',
        position: new THREE.Vector3(149.6, 0, 0),
        scale: 1.0,
        rotationSpeed: 0.1,
        orbitRadius: 149.6,
        orbitColor: 'lightblue',
        orbitSpeed: 0.03,
        currentAngle: Math.random() * Math.PI * 2,
        texturePath: '8k_earth_daymap.jpg'
    },
    { 
        name: 'Mars',
        position: new THREE.Vector3(227.9, 0, 0),
        scale: 0.532,
        rotationSpeed: 0.0097,
        orbitRadius: 227.9,
        orbitColor: 'pink',
        orbitSpeed: 0.0241,
        currentAngle: Math.random() * Math.PI * 2,
        texturePath: '8k_mars.jpg'
    },
    { 
        name: 'Jowisz',
        position: new THREE.Vector3(778.5, 0, 0),
        scale: 11.21,
        rotationSpeed: 0.024,
        orbitRadius: 778.5,
        orbitColor: 'tan',
        orbitSpeed: 0.0131,
        currentAngle: Math.random() * Math.PI * 2,
        texturePath: '8k_jupiter.jpg'
    },
    { 
        name: 'Saturn',
        position: new THREE.Vector3(1_433.5, 0, 0),
        scale: 9.45,
        rotationSpeed: 0.022,
        orbitRadius: 1_433.5,
        orbitColor: 'khaki',
        orbitSpeed: 0.0097,
        currentAngle: Math.random() * Math.PI * 2,
        texturePath: '4k_saturn.jpg'
    },
    { 
        name: 'Uran',
        position: new THREE.Vector3(2_872.5, 0, 0),
        scale: 4.01,
        rotationSpeed: -0.014,
        orbitRadius: 2_872.5,
        orbitColor: 'powderblue',
        orbitSpeed: 0.0068,
        currentAngle: Math.random() * Math.PI * 2,
        texturePath: '2k_uranus.jpg'
    },
    { 
        name: 'Neptun',
        position: new THREE.Vector3(4_495.1, 0, 0),
        scale: 3.88,
        rotationSpeed: 0.015,
        orbitRadius: 4_495.1,
        orbitColor: 'royalblue',
        orbitSpeed: 0.0054,
        currentAngle: Math.random() * Math.PI * 2,
        texturePath: '2k_neptune.jpg'
    }
];


  showOrbits: boolean = true;

  ngOnInit() {
    this.updatePlanetPositions(0);
  }

  ngAfterViewInit() {
    const scene = this.store.get('scene');
    scene.background = new THREE.Color('black');

    const textureLoader = new TextureLoader();
    textureLoader.load('8k_stars_milky_way.jpg', (texture) => {
      scene.background = texture;
    });

    scene.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
      this.cameraService.update();
      this.updatePlanetPositions(0.016);
    };

    this.cameraService.initialize(this.store);
    this.cameraService.setMode(CameraModeType.FREE);
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

  moveToPlanet(planet: Planet) {
    this.cameraService.setMode(CameraModeType.FOLLOW, planet.position, { 
      position: planet.position, 
      scale: planet.scale 
    });
    this.cdr.detectChanges();
  }

  toggleFreeCamera() {
    this.cameraService.setMode(CameraModeType.FREE);
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.toggleFreeCamera();
      }
    });
  }

}
