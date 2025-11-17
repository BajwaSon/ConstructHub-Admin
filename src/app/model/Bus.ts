/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from "@jot143/core-angular";
import { environment } from "../../environments/environment";

export class Bus extends Model<Bus> {
  override className: string = "Bus";
  id: string | "" = "";
  busNumber: string | "" = "";
  busType: string | "" = "";
  capacity: number | 0 = 0;
  driverId: string | "" = "";
  driverName: string | "" = "";
  status: any = "";
  createdAt?: string;
  updatedAt?: string;
  selected?: boolean;
  profile?: any = {};
  profilePhoto?: { value: string } | null = null;
  children?: any[] = [];
  get imageUrl() {
    if (!this.profile.profilePhoto?.value) {
      return "";
    }
    return this.profile.profilePhoto.value.startsWith("http") ? this.profile.profilePhoto.value : environment.assetsUrl + "/" + this.profile.profilePhoto.value;
  }
}
