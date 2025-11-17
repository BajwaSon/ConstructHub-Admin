import { Model } from "@jot143/core-angular";

export class TeacherByClass extends Model<TeacherByClass> {
  override className: string = "TeacherByClass";

  id: number | "" = "";
  name = "";
  description = "";

  updatedAt = "";
  createdAt = "";
  deletedAt = null;
}
