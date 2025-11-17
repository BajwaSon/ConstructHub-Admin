/* eslint-disable @typescript-eslint/no-explicit-any */

import { coreSignal } from "@jot143/core-angular";
import * as THREE from "three";
import { Model3D } from "./Model3D";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

declare let google: any;

export class WebglOverlayView {
  map: any;
  webgl: any;
  scene: any;
  renderer: any;
  camera: any;
  loader: any;
  raycaster!: THREE.Raycaster;

  onModelSelect: ((model: Model3D | null) => void) | null = null;
  models: Model3D[] = [];

  selectedModel: Model3D | null = null;

  private currentTransformer: any = null;
  private initialLatLng: { lat: number; lng: number } | null = null;

  ready = coreSignal(false);

  constructor(latitude: number, longitude: number) {
    this.initialLatLng = { lat: latitude, lng: longitude };

    this.webgl = new google.maps.WebGLOverlayView();

    this.webgl.onAdd = () => {
      // Initialize Three.js scene
      this.scene = new THREE.Scene();

      // Initialize perspective camera
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 20000);

      this.loader = new GLTFLoader();
      this.raycaster = new THREE.Raycaster();
      this.addAmbientLight();
    };

    this.webgl.onContextRestored = ({ gl }: any) => {
      // Initialize renderer with proper pixel ratio
      this.renderer = new THREE.WebGLRenderer({
        canvas: gl.canvas,
        context: gl,
        ...gl.getContextAttributes(),
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.autoClear = false;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // Signal ready state
      this.ready.setValue(true);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.webgl.onDraw = ({ gl, transformer }: any) => {
      // Store transformer for coordinate conversions
      this.currentTransformer = transformer;

      // Update lastLatLng with the current center
      const latLngAltitudeLiteral = {
        lat: latitude,
        lng: longitude,
        altitude: 0,
      };

      // Get the matrix from the transformer
      const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);

      // Update camera projection matrix
      this.camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);

      // Render the scene
      this.renderer.render(this.scene, this.camera);
      this.renderer.resetState();
    };
  }

  loadModel(model: Model3D) {
    this.models.push(model);
    this.loader.load(model.source, (gltf: any) => {
      // Apply the model's transform properties
      gltf.scene.scale.set(model.scale.x, model.scale.y, model.scale.z);

      gltf.scene.rotation.x = model.rotation.x;
      gltf.scene.rotation.y = model.rotation.y;
      gltf.scene.rotation.z = model.rotation.z;

      gltf.scene.position.x = model.position.x;
      gltf.scene.position.y = model.position.y;
      gltf.scene.position.z = model.position.z;

      // Add a unique identifier to help with debugging
      const modelId = Math.random().toString(36).substr(2, 9);

      // Explicitly set userData on the scene root
      gltf.scene.userData = {
        model3D: model,
        isModelRoot: true,
        modelId: modelId,
      };

      // Traverse all children and add model reference
      gltf.scene.traverse((node: any) => {
        // Ensure EVERY node has the model reference, not just meshes
        node.userData = {
          model3D: model,
          isModelPart: true,
          modelId: modelId,
        };

        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;

          if (node.material) {
            node.material.shadowSide = THREE.FrontSide;
            node.material.needsUpdate = true;
          }
        }
      });

      // Apply any custom rendering logic
      gltf.scene.traverse(model.childrenRender);

      // Store the 3D object on the model
      model.object3D = gltf.scene;

      // Add model to scene and log success
      this.scene.add(gltf.scene);
    });
  }

  setMap(map: any) {
    this.map = map;
    this.webgl.setMap(this.map);
  }

  addAmbientLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Reduced intensity for better shadow contrast
    this.scene.add(ambientLight);
  }

  addDirectionalLight(
    position: { x: number; y: number; z: number } = {
      x: 0.5,
      y: -1,
      z: 0.5,
    },
    intensity: number = 0.25
  ) {
    const directionalLight = new THREE.DirectionalLight(0xffffff, intensity);
    directionalLight.position.set(position.x, position.y, position.z);
    // directionalLight.castShadow = true;

    // Configure shadow properties
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    directionalLight.shadow.bias = -0.001;

    this.scene.add(directionalLight);
  }

  addToScene(object: any) {
    this.scene.add(object);
  }

  latLngToPosition(latitude: number, longitude: number, altitude: number = 0): THREE.Vector3 {
    if (!this.map) {
      console.warn("Map not available. Make sure the map is initialized.");
      return new THREE.Vector3(0, 0, 0);
    }

    // Calculate the x, y, z position based on the difference from initial position
    const origin = this.initialLatLng;
    if (!origin) {
      console.warn("Initial position not set");
      return new THREE.Vector3(0, 0, 0);
    }

    // Calculate differences in meters
    // Earth radius in meters
    const R = 6378137;

    // Convert to radians
    const lat1 = (origin.lat * Math.PI) / 180;
    const lon1 = (origin.lng * Math.PI) / 180;
    const lat2 = (latitude * Math.PI) / 180;
    const lon2 = (longitude * Math.PI) / 180;

    // Calculate distance in x direction (east-west)
    const x = R * Math.cos(lat1) * (lon2 - lon1);

    // Calculate distance in z direction (north-south)
    const z = R * (lat2 - lat1);

    // Y is up in Three.js, so altitude goes here
    const y = altitude;

    return new THREE.Vector3(x, y, z);
  }

  positionToLatLng(position: THREE.Vector3): { lat: number; lng: number; altitude: number } {
    if (!this.map) {
      console.warn("Map not available. Make sure the map is initialized.");
      return { lat: 0, lng: 0, altitude: 0 };
    }

    const origin = this.initialLatLng;
    if (!origin) {
      console.warn("Initial position not set");
      return { lat: 0, lng: 0, altitude: 0 };
    }

    // Earth radius in meters
    const R = 6378137;

    // Convert origin to radians
    const lat1 = (origin.lat * Math.PI) / 180;
    const lon1 = (origin.lng * Math.PI) / 180;

    // Calculate new latitude
    const latDiff = position.z / R;
    const lat2 = lat1 + latDiff;

    // Calculate new longitude
    const lonDiff = position.x / (R * Math.cos(lat1));
    const lon2 = lon1 + lonDiff;

    // Convert back to degrees
    const newLat = (lat2 * 180) / Math.PI;
    const newLng = (lon2 * 180) / Math.PI;

    // Altitude is simply the y coordinate
    const altitude = position.y;

    return {
      lat: newLat,
      lng: newLng,
      altitude: altitude,
    };
  }
}
