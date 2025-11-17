import { Model } from "@jot143/core-angular";

export class Profile extends Model<Profile> {
  override className: string = "Profile";
  profilePhoto?: { value: string } | null = null;
}
