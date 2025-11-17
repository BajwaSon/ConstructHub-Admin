/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from "@jot143/core-angular";

export class ClassSubject extends Model<ClassSubject> {
  override className: string = "ClassSubject";

  id: number | "" = "";
  name = "";
  createdAt = "";
  updatedAt = "";
  deletedAt = null;
  performanceOptions: any = [];
}
