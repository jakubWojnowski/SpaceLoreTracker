import {Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnChanges, SimpleChanges, OnInit, Output, EventEmitter} from '@angular/core';
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
export class SphereComponent implements OnChanges, OnInit {
  @Input() position: [number, number, number] = [0, 0, 0];
  @Input() scale: number = 1;
  @Input() color?: string;
  @Input() name: string = '';
  @Input() rotationSpeed: number = 0.01;
  @Input() texturePath: string = ''; // Dodaj input dla ścieżki tekstury
  @Output() clicked = new EventEmitter<void>(); // Dodaj output dla kliknięcia

  mesh?: THREE.Mesh;
  texture?: THREE.Texture;
  textureLoader: THREE.TextureLoader = new THREE.TextureLoader(); // Utwórz instancję bezpośrednio

  ngOnInit() {
    if (this.texturePath) {
      this.textureLoader.load(this.texturePath, (loadedTexture) => {
        this.texture = loadedTexture;
      });
    }
  }

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

  onClick() {
    this.clicked.emit();
  }

  protected readonly URL = URL;
}
