import { ClassDecorator, Model } from "@jot143/core-angular";
import { Classroom } from "./ClassRoom";
import { Floor } from "./Campus";
import { MarkerMatrix } from "./MarkerMatrix";

export class Humidity extends Model<Humidity> {
  override className: string = "Humidity";
  id = "";
  macId = "";
  latitude = "";
  longitude = "";
  floorId = "";
  selected = false;

  @ClassDecorator(() => new Classroom())
  classRoom: Classroom | null = null;

  @ClassDecorator(() => new Floor())
  floor: Floor | null = null;

  @ClassDecorator(() => new MarkerMatrix())
  markerMatrix: MarkerMatrix | null = null;
}
