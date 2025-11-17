/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "weekdayFilter",
})
export class WeekdayFilterPipe implements PipeTransform {
  transform(weekdays: any[], searchTerm: string): any[] {
    if (!weekdays) {
      return [];
    }

    if (!searchTerm) {
      return weekdays;
    }

    searchTerm = searchTerm.toLowerCase().trim();

    return weekdays.filter(weekday => {
      const name = (weekday.title || "").toLowerCase();
      const period = (weekday.period || "").toLowerCase();
      const imageUrl = (weekday.imageUrl || "").toLowerCase();

      return name.includes(searchTerm) || period.includes(searchTerm) || imageUrl.includes(searchTerm);
    });
  }
}
