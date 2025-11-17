import { Model } from "@jot143/core-angular";

export class School extends Model<School> {
  override className = "Child";

  id!: number;
  uuid!: string;
  name!: string;
  address!: string;
  domain!: string;
  ssl!: boolean;
  contactPersonName!: string;
  contactPersonEmail!: string;
  contactPersonMobile!: string;
  createdAt!: string;
  updatedAt!: string;
  deletedAt?: string | null;
}
