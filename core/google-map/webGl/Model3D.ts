/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { MyMap } from "./MyMap";

export class Model3D {
  source!: string;
  object3D!: THREE.Mesh<THREE.ShapeGeometry, THREE.MeshStandardMaterial, THREE.Object3DEventMap> | THREE.Group<THREE.Object3DEventMap>;

  constructor(source: string | THREE.Mesh<THREE.ShapeGeometry, THREE.MeshStandardMaterial, THREE.Object3DEventMap> | THREE.Group<THREE.Object3DEventMap>) {
    if (source instanceof THREE.Mesh) {
      this.object3D = source;
    } else if (source instanceof THREE.Group) {
      this.object3D = source;
    } else {
      this.source = source;
    }
  }

  scale: { x: number; y: number; z: number } = { x: 1, y: 1, z: 1 };
  rotation: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  position: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };

  renderOrder: number = 1;

  setScale(x: number, y: number, z: number) {
    this.scale = { x, y, z };
  }

  setRotation(x: number, y: number, z: number) {
    this.rotation = { x, y, z };
  }

  setPosition(x: number, y: number, z: number) {
    this.position = { x, y, z };
  }

  changeScale(newScale: { x: number; y: number; z: number }) {
    this.scale = newScale;
    if (this.object3D) {
      this.object3D.scale.set(newScale.x, newScale.y, newScale.z);
    } else {
      console.warn("No object3D found, model not loaded");
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  childrenRender(child: any) {}

  render(myMap: MyMap) {
    if (this.object3D) {
      this.object3D.position.set(this.position.x, this.position.y, this.position.z);
      this.object3D.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
      this.object3D.scale.set(this.scale.x, this.scale.y, this.scale.z);

      // Update the matrix to ensure changes are reflected
      this.object3D.updateMatrix();
      this.object3D.updateMatrixWorld(true);
      myMap.webgl.renderer.render(myMap.webgl.scene, myMap.webgl.camera);
      myMap.webgl.renderer.resetState();
    }
  }
}
