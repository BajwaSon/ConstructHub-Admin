import { Model } from "@jot143/core-angular";

export class Holiday extends Model<Holiday> {
  override className: string = "Holiday";

  id: number | "" = "";
  name = "";
  description = "";

  updatedAt = "";
  createdAt = "";
  deletedAt = null;
}
