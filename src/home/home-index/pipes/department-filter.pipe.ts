/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "departmentFilter",
})
export class DepartmentFilterPipe implements PipeTransform {
  transform(departments: any[], searchTerm: string): any[] {
    if (!departments || !searchTerm) {
      return departments;
    }
    return departments.filter(department => department.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }
}
