/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "studentFilterByLevel",
})
export class StudentFilterByLevelPipe implements PipeTransform {
  transform(students: any[], searchTerm: string): any[] {
    if (!students) {
      return [];
    }

    if (!searchTerm) {
      return students;
    }

    searchTerm = searchTerm.toLowerCase().trim();

    return students.filter(student => {
      const firstName = (student.firstName || "").toLowerCase();
      const middleName = (student.middleName || "").toLowerCase();
      const lastName = (student.lastName || "").toLowerCase();
      const referenceId = (student.referenceId || "").toLowerCase();

      return firstName.includes(searchTerm) || middleName.includes(searchTerm) || lastName.includes(searchTerm) || referenceId.includes(searchTerm);
    });
  }
}
