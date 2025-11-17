/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrayClassDecorator, ClassDecorator, Model, User } from "@jot143/core-angular";
import { environment } from "../../environments/environment";
import { Polygon } from "@jot143/core-interactive-map";
import { Gateway } from "./Gateway";
import { Profile } from "./Profile";

export class Classroom extends Model<Classroom> {
  override className: string = "Classroom";
  id = "";
  roomGeoLocation = "";
  roomGatewayID = "";
  roomNumber = "";
  roomThumbnail = "";
  roomGeometry: Polygon | null = null;
  roomName = "";
  roomLatitude = "";
  roomLongitude = "";
  roomLength = "";
  roomWidth = "";
  roomHeight = "";
  selected = false;
  floor?: any = {};

  @ArrayClassDecorator(() => new Gateway())
  gateway: Gateway[] = [];

  @ClassDecorator(() => new User())
  user: User | null = null;

  @ClassDecorator(() => new Profile())
  profile?: Profile | null = null;

  profilePhoto?: { value: string } | null = null;

  get imageUrl() {
    if (!this.profile?.profilePhoto?.value) {
      return "";
    }
    return this.profile.profilePhoto.value.startsWith("http") ? this.profile.profilePhoto.value : environment.assetsUrl + "/" + this.profile.profilePhoto.value;
  }
}
