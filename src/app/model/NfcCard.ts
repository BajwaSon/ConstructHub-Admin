import { Model } from "@jot143/core-angular";

export class NfcCard extends Model<NfcCard> {
  override className: string = "NfcCard";

  id: number | "" = "";
  name = "";
  macId = "";
  teacherId = "";
  selected = false;
  updatedAt = "";
  createdAt = "";
  deletedAt = null;
}
