/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from "@jot143/core-angular";

export class PerformanceOption extends Model<PerformanceOption> {
  override className: string = "PerformanceOption";

  id: number | "" = "";
  name = "";
  createdAt = "";
  updatedAt = "";
  deletedAt = null;
  performanceOptions: any = [];
}
