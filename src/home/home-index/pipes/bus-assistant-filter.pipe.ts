/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "busAssistantFilter",
})
export class BusAssistantFilterPipe implements PipeTransform {
  transform(busAssistants: any[], searchTerm: string): any[] {
    if (!busAssistants) {
      return [];
    }

    if (!searchTerm) {
      return busAssistants;
    }

    searchTerm = searchTerm.toLowerCase().trim();

    return busAssistants.filter(busAssistant => {
      const firstName = (busAssistant.firstName || "").toLowerCase();
      const middleName = (busAssistant.middleName || "").toLowerCase();
      const lastName = (busAssistant.lastName || "").toLowerCase();
      const referenceId = (busAssistant.referenceId || "").toLowerCase();

      return firstName.includes(searchTerm) || middleName.includes(searchTerm) || lastName.includes(searchTerm) || referenceId.includes(searchTerm);
    });
  }
}
