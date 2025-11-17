/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "holidayFilter",
})
export class HolidayFilterPipe implements PipeTransform {
  transform(holidays: any[], searchTerm: string): any[] {
    if (!holidays) {
      return [];
    }

    if (!searchTerm) {
      return holidays;
    }

    searchTerm = searchTerm.toLowerCase().trim();

    return holidays.filter(holiday => {
      const name = (holiday.title || "").toLowerCase();
      const date = (holiday.date || "").toLowerCase();
      const imageUrl = (holiday.imageUrl || "").toLowerCase();

      return name.includes(searchTerm) || date.includes(searchTerm) || imageUrl.includes(searchTerm);
    });
  }
}
