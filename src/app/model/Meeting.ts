/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from "@jot143/core-angular";
// import { environment } from "../../environments/environment";

// interface RecurringDate {
//   start: string; // ISO string format
//   end: string;   // ISO string format
// }
export class Meeting extends Model<Meeting> {
  override className: string = "Meeting";

  id: number = 0;
  title: string = "";
  namespace: string = "";
  recurringDates: any;
  classSectionId?: any = "";
  // get imageUrl() {
  //   return this.profilePhoto?.value?.startsWith("https") ? this.profilePhoto.value : environment.profileImageBaseUrl + this.profilePhoto?.value;
  // }
}
