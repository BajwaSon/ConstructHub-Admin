/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassDecorator, Model, User } from "@jot143/core-angular";
import { environment } from "../../environments/environment";
// import { environment } from "../../environments/environment";

export class Teacher extends Model<Teacher> {
  override className: string = "Teacher";

  designation: any;
  dob = "";
  email = "";
  gender: "male" | "female" | "other" = "male";
  id: number | "" = "";
  name = "";
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phoneNo = "";
  updatedAt = "";
  createdAt = "";
  deletedAt = null;
  selected = false;
  isConnected = false;
  subjects?: any[] = [];
  profile: any;
  classSections?: any[] = [];
  classLevels?: any[] = [];
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
