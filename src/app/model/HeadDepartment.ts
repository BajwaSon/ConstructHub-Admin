/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, User, ClassDecorator } from "@jot143/core-angular";

export class HeadDepartment extends Model<HeadDepartment> {
  override className: string = "HeadDepartment";

  designation = "Head Department";
  dob = "";
  email = "";
  gender: "male" | "female" | "other" = "male";
  id: number | "" = "";
  name = "";
  phoneNo = "";
  updatedAt = "";
  createdAt = "";
  deletedAt = null;
  profile: any;
  @ClassDecorator(() => new User())
  user: User | null = null;
}
