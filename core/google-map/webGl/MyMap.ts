/* eslint-disable @typescript-eslint/no-explicit-any */

import { WebglOverlayView } from "./WebglOverlayView";
import TWEEN from "@tweenjs/tween.js";

declare let google: any;

export class MyMap {
  map: any;
  mapData: any;
  webgl!: WebglOverlayView;

  latitude = 24.436721;
  longitude = 54.399911;

  viewType: "3d" | "2d" = "3d";

  lastTouchDistance = 0;
  isPinching = false;

  setDefaultLatLng(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  async initMap(
    mapElement: any,
    cameraOptions: { tilt: number; heading: number; zoom: number } = {
      tilt: 0,
      heading: 0,
      zoom: 12,
    }
  ) {
    const mapOptions = {
      ...cameraOptions,
      center: { lat: this.latitude, lng: this.longitude },
      mapId: "6908a4c4080d1d49",
      streetViewControl: false,
      mapTypeControl: false,
      disableDefaultUI: true,
      rotateControl: true,
    };

    this.map = new google.maps.Map(mapElement, mapOptions);
    this.mapData = new google.maps.Data();
    this.mapData.setMap(this.map);

    return await { map: this.map };
  }

  initWebGL() {
    if (this.viewType == "3d") {
      this.webgl = new WebglOverlayView(this.latitude, this.longitude);
      this.webgl.setMap(this.map);
      return this.webgl;
    }
    return null;
  }

  // TeenJs
  // TeenJs
  connectTeenJs(
    cameraOptions: { tilt: number; heading: number; zoom: number } = {
      tilt: 0,
      heading: 0,
      zoom: 12,
    }
  ) {
    new TWEEN.Tween(cameraOptions) // Create a new tween that modifies 'cameraOptions'.
      .to({ tilt: 45, heading: -25, zoom: 19 }, 5000) // Move to destination in 15 second.
      .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
      .onUpdate(() => {
        this.map.moveCamera(cameraOptions);
      })
      .start(0); // Start the tween immediately.

    // Setup the animation loop.
    function animate(time: any) {
      requestAnimationFrame(animate);
      TWEEN.update(time);
    }
    requestAnimationFrame(animate);
  }

  panTo(latitude: number, longitude: number, zoom: number = 14, duration: number = 1000) {
    const startTime = performance.now();

    // Get current camera state
    const startCenter = this.map.getCenter();
    const startZoom = this.map.getZoom();
    const startTilt = this.map.getTilt();
    const startHeading = this.map.getHeading();

    // Get start coordinates
    const startLat = startCenter.lat();
    const startLng = startCenter.lng();

    // Calculate the shortest path for longitude (handling 180° meridian)
    let deltaLng = longitude - startLng;
    if (Math.abs(deltaLng) > 180) {
      deltaLng = deltaLng > 0 ? deltaLng - 360 : deltaLng + 360;
    }

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smoother easing function
      const easeProgress = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

      // Linear interpolation for position with bounds checking
      const currentLat = startLat + (latitude - startLat) * easeProgress;
      const currentLng = startLng + deltaLng * easeProgress;

      // Ensure longitude stays within bounds
      const boundedLng = ((currentLng + 180) % 360) - 180;

      // Interpolate other camera parameters
      const currentZoom = startZoom + (zoom - startZoom) * easeProgress;
      const currentTilt = startTilt + (45 - startTilt) * easeProgress;

      // Update camera
      const cameraUpdate = {
        center: new google.maps.LatLng(currentLat, boundedLng),
        zoom: currentZoom,
        tilt: currentTilt,
        heading: startHeading,
      };

      this.map.moveCamera(cameraUpdate);

      // Continue animation if not complete
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    // Start animation
    requestAnimationFrame(animate);
  }

  smoothRotateMap(map: any, targetHeading: number, duration: number = 1000) {
    if (!map) return;

    const currentHeading = map.getHeading();
    new TWEEN.Tween({ heading: currentHeading })
      .to({ heading: targetHeading }, duration)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(({ heading }) => {
        this.rotateMap(map, heading);
      })
      .start(0);
  }

  smoothTiltMap(map: any, targetTilt: number, duration: number = 1000) {
    if (!map) return;

    const currentTilt = map.getTilt();
    new TWEEN.Tween({ tilt: currentTilt })
      .to({ tilt: targetTilt }, duration)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(({ tilt }) => {
        this.tiltMap(map, tilt);
      })
      .start(0);
  }

  rotateMap(map: any, heading: number) {
    if (map) {
      map.setHeading(heading);
    }
  }

  tiltMap(map: any, tilt: number) {
    if (map) {
      map.setTilt(tilt);
    }
  }

  // Movement controls
  rotateLeft(num: number) {
    const currentHeading = this.map.getHeading();
    this.smoothRotateMap(this.map, currentHeading - num);
  }

  rotateRight(num: number) {
    const currentHeading = this.map.getHeading();
    this.smoothRotateMap(this.map, currentHeading + num);
  }

  tiltUp(num: number) {
    const currentTilt = this.map.getTilt();
    this.smoothTiltMap(this.map, Math.min(currentTilt + num, 67.5));
  }

  tiltDown(num: number) {
    const currentTilt = this.map.getTilt();
    this.smoothTiltMap(this.map, Math.max(currentTilt - num, 0));
  }
}
