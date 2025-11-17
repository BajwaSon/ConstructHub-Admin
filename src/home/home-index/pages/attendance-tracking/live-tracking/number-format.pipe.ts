import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "numberFormat",
})
export class NumberFormatPipe implements PipeTransform {
  transform(value: number): string {
    if (value >= 1000) {
      const kValue = (value / 1000).toFixed(1);
      return kValue.endsWith(".0") ? kValue.slice(0, -2) + "k" : kValue + "k";
    }
    return value.toString();
  }
}
