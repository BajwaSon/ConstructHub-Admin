import { Model } from "@jot143/core-angular";
import { ClassSubject } from "./classSubject";
export class ClassLevel extends Model<ClassLevel> {
  override className: string = "ClassLevel";

  id: number | "" = "";
  levelName = "";
  createdAt = "";
  updatedAt = "";
  deletedAt = null;
  subjects: ClassSubject[] = [];
}
