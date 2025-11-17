/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";

@Component({
  selector: "app-single-select-subject",
  imports: [MatFormFieldModule, MatSelectModule],
  templateUrl: "./single-select-subject.component.html",
  styleUrl: "./single-select-subject.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleSelectSubjectComponent implements OnInit {
  @Input() options: any[] = [];
  @Input() selectedValue?: string | null = null;
  @Output() selectedValueChange = new EventEmitter<any>();

  ngOnInit() {
    if (!this.selectedValue && this.options.length > 0) {
      this.selectedValue = this.options[0]?.value;
      this.selectedValueChange.emit(this.selectedValue); // Ensure event is emitted
    }
  }

  onSelectChange(event: any) {
    this.selectedValueChange.emit(event.value);
  }
  getSelectedValue() {
    return this.selectedValue;
  }
}
