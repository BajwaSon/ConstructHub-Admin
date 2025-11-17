import { Model } from "@jot143/core-angular";

export class Workdays extends Model<Workdays> {
  override className: string = "Workdays";

  id: number | "" = "";
  name = "";
  description = "";

  updatedAt = "";
  createdAt = "";
  deletedAt = null;
}
