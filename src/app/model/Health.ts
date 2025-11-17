/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassDecorator, Model, User } from "@jot143/core-angular";
import { environment } from "../../environments/environment";

export class Health extends Model<Health> {
  override className: string = "Health";

  designation = "Health";
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
  symptomName: string = "";
  children: Health[] = [];
  profile?: any = {};
  profilePhoto?: { value: string } | null = null;
  photo?: { value: string } | null = null;
  @ClassDecorator(() => new User())
  user: User | null = null;

  get imageUrl() {
    if (!this.profile.profilePhoto?.value) {
      return "";
    }
    return this.profile.profilePhoto.value.startsWith("http") ? this.profile.profilePhoto.value : environment.assetsUrl + "/" + this.profile.profilePhoto.value;
  }
}
