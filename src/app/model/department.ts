import { Model } from "@jot143/core-angular";
import { Teacher } from "./Teacher";

export class Department extends Model<Department> {
  override className: string = "ClassLevel";

  id = "";
  name = "";
  createdAt = "";
  updatedAt = "";
  deletedAt = null;
  users: Teacher[] = [];
}
