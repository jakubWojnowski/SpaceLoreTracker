import { Component } from '@angular/core';
import {SceneGraphComponent} from "./scene-graph/scene-graph.component";

import { NgtCanvas, extend } from 'angular-three';
import * as THREE from 'three';
import { RouterOutlet } from '@angular/router';
import {Scene} from "three";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgtCanvas],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SpaceLoreTrackerFE';
  readonly SceneGraph = SceneGraphComponent;

}
