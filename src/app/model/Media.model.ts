import { Model } from "@jot143/core-angular";
import { environment } from "../../environments/environment";

export class Media extends Model<Media> {
  override className: string = "Media";

  id: number = 0;
  uuid: string = "";
  source: string = "";
  value: string = "";
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  deletedAt: Date | null = null;

  get url() {
    if (this.source === "local") {
      return environment.assetsUrl + "/" + this.value;
    }

    if (this.source === "url") {
      return this.value;
    }

    return "";
  }
}
