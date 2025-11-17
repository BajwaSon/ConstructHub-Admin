/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "teacherFilter",
})
export class TeacherFilterPipe implements PipeTransform {
  transform(teachers: any[], searchTerm: string): any[] {
    if (!teachers) {
      return [];
    }

    if (!searchTerm) {
      return teachers;
    }

    searchTerm = searchTerm.toLowerCase().trim();

    return teachers.filter(teacher => {
      const firstName = (teacher.profile.firstName || "").toLowerCase();
      const middleName = (teacher.profile.middleName || "").toLowerCase();
      const lastName = (teacher.profile.lastName || "").toLowerCase();
      const referenceId = (teacher.profile.referenceId || "").toLowerCase();
      const phoneNo = (teacher.profile.phoneNo || "").toLowerCase();

      return firstName.includes(searchTerm) || middleName.includes(searchTerm) || lastName.includes(searchTerm) || referenceId.includes(searchTerm) || phoneNo.includes(searchTerm);
    });
  }
}
