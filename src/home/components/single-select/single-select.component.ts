/* eslint-disable @typescript-eslint/no-explicit-any */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-single-select",
  imports: [MatFormFieldModule, MatSelectModule, CommonModule],
  templateUrl: "./single-select.component.html",
  styleUrl: "./single-select.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleSelectComponent implements OnInit {
  @Input() options: any[] = [];
  @Input() selectedValue?: string | null | number = null;
  @Output() selectedValueChange = new EventEmitter<any>();

  ngOnInit() {
    if (this.selectedValue == "null" || this.selectedValue == null || this.selectedValue == undefined || this.selectedValue == "") {
      this.selectedValue = "";
    }
    if (this.options.length > 0 && !this.selectedValue) {
      this.selectedValue = this.options[0]?.value || "";
      this.selectedValueChange.emit(this.selectedValue);
    }
  }

  onSelectChange(event: any) {
    this.selectedValue = event.value;
    this.selectedValueChange.emit(this.selectedValue);
  }

  get getSelectedValue() {
    if (this.selectedValue == "null" || this.selectedValue == null || this.selectedValue == undefined || this.selectedValue == "") {
      return "";
    }
    return this.selectedValue;
  }
}
