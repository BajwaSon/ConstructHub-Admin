import { Model } from "@jot143/core-angular";

export class MarkerMatrix extends Model<MarkerMatrix> {
  override className: string = "MarkerMatrix";

  title: string = "";
  description: string = "";
  iconUrl: string | null = null;
  draggable: boolean = false;
  size: number = 0;

  id = "";
  x: number | null = null;
  y: number | null = null;
  lat: number | null = null;
  lng: number | null = null;

  get latitude() {
    return this.lat?.toString() || "";
  }

  get longitude() {
    return this.lng?.toString() || "";
  }

  set latitude(value: string) {
    this.lat = parseFloat(value);
  }

  set longitude(value: string) {
    this.lng = parseFloat(value);
  }
}
