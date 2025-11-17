/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";

declare let google: any;

@Injectable({
  providedIn: "root",
})
export class GoogleMapService {
  googleMap: any = google;
  googleGeolocation: any = google.maps.Geolocation;
  googleGeocoder: any = google.maps.Geocoder;

  initDirectionsRenderer() {
    return new google.maps.DirectionsRenderer();
  }

  changeCenterMap(map: any, lat: any, lng: any) {
    const latLng = new google.maps.LatLng(lat, lng);
    map.panTo(latLng);
  }

  addMarker(map: any, lat: any, lng: any, draggable = false, listeners: any = null, customIcon: any = null, infoWindow: any = null) {
    const position = { lat, lng };
    const marker = new google.maps.Marker({
      position,
      map,
      draggable,
      icon: customIcon,
    });

    if (listeners != null) {
      for (const listener in listeners) {
        google.maps.event.addListener(marker, listener, function () {
          listeners[listener](marker);
        });
      }
    }

    if (infoWindow) {
      const infoWindow = new google.maps.InfoWindow();
      const div = document.createElement("div");
      div.append(infoWindow.location.nativeElement);

      google.maps.event.addListener(
        marker,
        "click",
        (function (marker) {
          return function () {
            infoWindow.setContent(div);
            infoWindow.open(map, marker);
          };
        })(marker)
      );
    }

    return marker;
  }

  setBound(map: any, latLngArray: Array<any>) {
    const bounds = new google.maps.LatLngBounds();

    for (const latLng of latLngArray) {
      bounds.extend(new google.maps.LatLng(latLng.lat, latLng.lng));
    }

    map.fitBounds(bounds);
  }

  addMultiMarker(map: any, locations: Array<any>, customIcon: any = undefined) {
    const infoWindow = new google.maps.InfoWindow();

    let markers = [],
      marker,
      i;
    const bounds = new google.maps.LatLngBounds();
    for (i = 0; i < locations.length; i++) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
        map: map,
        icon: customIcon,
      });

      bounds.extend(marker.getPosition());

      if (locations[i].infoWindow) {
        locations[i].infoWindow.instance.marker = marker;
        const div = document.createElement("div");
        div.append(locations[i].infoWindow.location.nativeElement);

        google.maps.event.addListener(
          marker,
          "click",
          (function (marker, i) {
            return function () {
              infoWindow.setContent(div);
              infoWindow.open(map, marker);
            };
          })(marker, i)
        );
      }

      markers.push({ marker, infoWindow: locations[i].infoWindow });
    }
    map.fitBounds(bounds);

    return markers;
  }

  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      this.googleGeolocation
        .getCurrentPosition()
        .then((resp: any) => {
          resolve({ lat: resp.coords.latitude, lng: resp.coords.longitude });
        })
        .catch((error: any) => {
          reject(false);
          console.debug("Error getting location", error);
        });
    });
  }

  decodePath(path: string) {
    return google.maps.geometry.encoding.decodePath(path);
  }

  getReverseGeocodingData(lat: any, lng: any) {
    return new Promise(resolve => {
      const latLng = new google.maps.LatLng(lat, lng);
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ latLng: latLng }, (results: any, status: any) => {
        if (status !== google.maps.GeocoderStatus.OK) {
          resolve(false);
        }

        if (status === google.maps.GeocoderStatus.OK) {
          if (results.length > 0) {
            const fetchAddress = (_results: any) => {
              for (const result of _results) {
                if (
                  result.types.includes("premise") ||
                  result.types.includes("street_address") ||
                  result.types.includes("route") ||
                  result.types.includes("political") ||
                  result.types.includes("sublocality") ||
                  result.types.includes("sublocality_level_1") ||
                  result.types.includes("sublocality_level_2")
                ) {
                  return result.formatted_address;
                }
              }
              return results[0].formatted_address;
            };
            resolve(fetchAddress(results));
          } else {
            resolve(false);
          }
        }
      });
    });
  }

  getForwardGeocodingData(address: any) {
    return new Promise(resolve => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results: any, status: any) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results.length > 0) {
            resolve(results[0].geometry.location);
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      });
    });
  }

  getPolyline(obj: any) {
    if (obj?.path?.encoded === true) {
      obj.path = this.decodePath(obj?.path?.code);
    }

    obj.zIndex = 2000;
    return new google.maps.Polyline(obj);
  }

  getPolygon(obj: any) {
    return new google.maps.Polygon(obj);
  }

  // Geo JSON
  // async getGeoJSON() {
  //   const geoJSON = await import("../../assets/school.json");
  //   return geoJSON;
  // }

  addGeoJSON(map: any, geoJSON: any) {
    const geoJSONLayer = new google.maps.GeoJsonLayer({
      geoJson: geoJSON,
    });
    geoJSONLayer.setMap(map);
  }
}
