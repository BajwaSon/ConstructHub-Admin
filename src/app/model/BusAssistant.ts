/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassDecorator, Model, User } from "@jot143/core-angular";
import { environment } from "../../environments/environment";
import { Child } from "./Child";

export class BusAssistant extends Model<BusAssistant> {
  override className: string = "BusAssistant";

  designation: any;
  dob = "";
  email = "";
  gender: "male" | "female" | "other" = "male";
  id: number | "" = "";
  name = "";
  phoneNo = "";
  updatedAt = "";
  createdAt = "";
  deletedAt = null;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  children: Child[] = [];
  selected = false;
  profile?: any = {};
  profilePhoto?: { value: string } | null = null;
  @ClassDecorator(() => new User())
  user: User | null = null;
  get imageUrl() {
    if (!this.profile.profilePhoto?.value) {
      return "";
    }
    return this.profile.profilePhoto.value.startsWith("http") ? this.profile.profilePhoto.value : environment.assetsUrl + "/" + this.profile.profilePhoto.value;
  }
}
