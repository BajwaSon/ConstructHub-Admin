/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrayClassDecorator, ClassDecorator, Model, User } from "@jot143/core-angular";
import { environment } from "../../environments/environment";
import { PerformanceOption } from "./PerformanceOption";

export class ClassSection extends Model<ClassSection> {
  override className: string = "ClassSection";
  classSectionName = "";
  classLevel?: any;
  id = "";
  firstName = "";
  middleName = "";
  lastName = "";
  classStudents?: any;
  children?: any[] = [];
  students?: any[] = [];
  classRoom?: any;
  profilePhoto?: { value: string } | null = null;
  profile?: any = {};
  selected = false;
  profilePhotoID: string | null = null;
  referenceId = "";
  @ArrayClassDecorator(() => new PerformanceOption())
  performanceOptions: PerformanceOption[] = [];

  @ClassDecorator(() => new User())
  user: User | null = null;
  gender = "";
  origin = "";
  createdAt = "";
  deletedAt = "";
  classLevelId = "";

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
