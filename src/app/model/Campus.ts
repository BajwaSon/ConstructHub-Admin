/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrayClassDecorator, ClassDecorator, Model, User } from "@jot143/core-angular";
import { Media } from "./Media.model";
import { environment } from "../../environments/environment";

export class Floor extends Model<Floor> {
  override className: string = "Floor";

  id: number = 0;
  floorNumber: number = 0;
  floorName: string = "";
  description: string = "";
  buildingId: number = 0;
  createdAt: string = "";
  updatedAt: string = "";
  deletedAt: string | null = null;

  floorMapGeometry: any | undefined = undefined;

  @ClassDecorator(() => new Media())
  floorMapPhoto: Media | null = null;

  get floorMapPhotoUrl() {
    if (!this.floorMapPhoto?.value) {
      return "";
    }
    return this.floorMapPhoto.value.startsWith("http") ? this.floorMapPhoto.value : environment.assetsUrl + "/" + this.floorMapPhoto.value;
  }

  buildingName: string | undefined = undefined;
  campusName: string | undefined = undefined;
}

export class Building extends Model<Building> {
  override className: string = "Building";

  id: number = 0;
  name: string = "";
  buildingCode: string = "";
  description: string = "";
  campusId: number = 0;
  createdAt: string = "";
  updatedAt: string = "";
  deletedAt: string | null = null;

  latitude: string = "";
  longitude: string = "";

  @ArrayClassDecorator(() => new Floor())
  floors: Floor[] = [];
}

export class Campus extends Model<Campus> {
  override className: string = "Campus";
  selected = false;
  id: number = 0;
  name: string = "";
  campusCode: string = "";
  address: string = "";
  blockNo: string = "";
  city: string = "";
  state: string = "";
  country: string = "";
  postalCode: string = "";
  latitude: string = "";
  longitude: string = "";
  contactEmail: string = "";
  contactPhone: string = "";
  createdAt: string = "";
  updatedAt: string = "";
  deletedAt: string | null = null;

  isCollapsed: boolean = false;

  @ClassDecorator(() => new User())
  user: User | null = null;

  @ArrayClassDecorator(() => new Building())
  buildings: Building[] = [];
}
