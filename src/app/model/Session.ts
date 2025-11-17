import { Model } from "@jot143/core-angular";

export class Session extends Model<Session> {
  override className: string = "Session";

  id: number | "" = "";
  name: string = "";
  sessionStartDate: string = "";
  sessionEndDate: string = "";
  isActive: boolean = false;
  createdAt: string = "";
  updatedAt: string = "";
  deletedAt: string | null = null;
}
