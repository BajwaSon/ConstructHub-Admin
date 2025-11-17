import { Model } from "@jot143/core-angular";

export class Watches extends Model<Watches> {
  override className: string = "Watches";

  id: number | "" = "";
  name = "";
  macId = "";
  manufacturer = "";
  status = "";
  childId = "";
  selected = false;
  updatedAt = "";
  createdAt = "";
  deletedAt = null;
}
