/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "userFilter",
})
export class UserFilterPipe implements PipeTransform {
  transform(users: any[], searchTerm: string): any[] {
    if (!users || !searchTerm) {
      return users;
    }
    return users.filter((user: any) => user.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }
}
