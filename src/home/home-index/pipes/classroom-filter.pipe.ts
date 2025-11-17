/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "classroomFilter",
})
export class ClassroomFilterPipe implements PipeTransform {
  transform(classrooms: any[], searchQuery: string): any[] {
    if (!classrooms || !searchQuery) {
      return classrooms;
    }
    searchQuery = searchQuery.toLowerCase();
    return classrooms.filter(
      classroom =>
        classroom.name.toLowerCase().includes(searchQuery) || classroom.number.toLowerCase().includes(searchQuery) || classroom.gatewayId.toLowerCase().includes(searchQuery)
    );
  }
}
