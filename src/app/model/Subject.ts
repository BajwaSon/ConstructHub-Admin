import { Model } from "@jot143/core-angular";

export class Subject extends Model<Subject> {
  override className: string = "Subject";

  id: number | "" = "";
  name = "";

  updatedAt = "";
  createdAt = "";
  deletedAt = null;
}
