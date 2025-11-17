/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from "@jot143/core-angular";
import { BehaviorSubject } from "rxjs";
import { environment } from "../../environments/environment";

export class Child extends Model<Child> {
  override className = "Child";

  id: number | "" = "";
  name: string = "";
  firstName: string = "";
  lastName: string = "";
  middleName: string = "";
  origin: string = "";
  gender: string = "";
  updatedAt: string = "";
  createdAt: string = "";
  deletedAt: string | null = null;
  profilePhotoID: string = "";
  profilePhoto?: { value: string } | null = null;
  profilePhotoThumbnail: string = "";
  school: any = {};
  referenceId: string = "";
  classLevel: any = {};
  classes: any;
  avatar: string = "";
  schoolId: number | "" = "";
  classLevelId: number | "" = "";
  commonServerId: number | "" = "";

  profile?: any = {};
  // lifecycle events
  serverSetup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  populated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  changes: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get image() {
    return "/assets/images/dummy-child.png";
  }

  get imageUrl() {
    if (!this.profilePhoto?.value) {
      return "";
    }
    return this.profilePhoto?.value.startsWith("http") ? this.profilePhoto?.value : environment.assetsUrl + "/" + this.profilePhoto?.value;
  }
  get imageProfileUrl() {
    if (!this.profile?.profilePhoto?.value) {
      return "";
    }
    return this.profile?.profilePhoto?.value.startsWith("http") ? this.profile?.profilePhoto?.value : environment.assetsUrl + "/" + this.profile?.profilePhoto?.value;
  }
}

// import { Model, User, ClassDecorator } from "@jot143/core-angular";

// export class Child extends Model<Child> {
//   override className: string = "Child";

//   id: number | "" = "";
//   classLevelId: number | "" = "";
//   referenceId = "";
//   firstName = "";
//   lastName = "";
//   middleName = "";
//   origin = "";
//   gender: "male" | "female" | "other" = "male";
//   updatedAt = "";
//   createdAt = "";
//   deletedAt = null;

//   @ClassDecorator(() => new User())
//   user: User | null = null;
// }
