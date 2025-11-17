/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filterLevels",
})
export class FilterLevelsPipe implements PipeTransform {
  transform(levels: any[], searchText: string): any[] {
    if (!levels) return [];
    if (!searchText) return levels;
    searchText = searchText.toLowerCase();
    return levels.filter(level => level.label.toLowerCase().includes(searchText));
  }
}
