/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassDecorator, Model, User } from "@jot143/core-angular";
import { environment } from "../../environments/environment";

export class Admin extends Model<Admin> {
  override className: string = "Admin";

  dob = "";
  email = "";
  gender: "male" | "female" | "other" = "male";
  id: number | "" = "";
  firstName?: string;
  middleName?: string;
  lastName?: string;
  name = "";
  phoneNo = "";
  updatedAt = "";
  createdAt = "";
  deletedAt = null;
  department?: any[] = [];
  designation?: any = null;
  profile?: any = {};
  selected = false;
  @ClassDecorator(() => new User())
  user: User | null = null;
  profilePhoto?: { value: string } | null = null;

  get imageUrl() {
    if (!this.profile.profilePhoto?.value) {
      return "";
    }
    return this.profile.profilePhoto.value.startsWith("http") ? this.profile.profilePhoto.value : environment.assetsUrl + "/" + this.profile.profilePhoto.value;
  }
}
