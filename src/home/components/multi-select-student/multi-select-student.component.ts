/* eslint-disable @angular-eslint/no-output-on-prefix */
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Input, model, Output, signal } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipsModule, MatChipInputEvent } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";

@Component({
  selector: "app-multi-select-student",
  imports: [MatFormFieldModule, MatSelectModule, MatChipsModule, MatIconModule, MatAutocompleteModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./multi-select-student.component.html",
  styleUrl: "./multi-select-student.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectStudentComponent {
  @Input() allItems: { label: string; value: string }[] = [];
  @Input() set initialSelectedItems(items: { label: string; value: string }[]) {
    this.selectedItems.set(items || []);
  }

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly searchString = model("");

  readonly selectedItems = signal<{ label: string; value: string }[]>([]);

  readonly filteredOptions = computed(() => {
    const searchString = this.searchString().toLowerCase();
    const selectedValues = new Set(this.selectedItems().map(item => item.value));
    return this.allItems;
    return this.allItems.filter(
      item => !selectedValues.has(item.value) && (searchString === "" || item.label.toLowerCase().includes(searchString) || item.value.toLowerCase().includes(searchString))
    );
  });

  readonly announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();
    if (!value) return;

    const selectedItem = this.allItems.find(item => item.value.toLowerCase() === value.toLowerCase() || item.label.toLowerCase() === value.toLowerCase());

    if (selectedItem && !this.selectedItems().some(item => item.value === selectedItem.value)) {
      this.selectedItems.update(items => [...items, selectedItem]);
      this.announcer.announce(`Added ${selectedItem.label}`);
    }

    event.chipInput!.clear();
    this.searchString.set("");
  }

  remove(item: { label: string; value: string }): void {
    this.selectedItems.update(items => {
      const filtered = items.filter(existing => existing.value !== item.value);
      if (filtered.length !== items.length) {
        this.announcer.announce(`Removed ${item.label}`);
      }
      return filtered;
    });

    this.onSelectedItems.emit(this.selectedItems());
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedItem = this.allItems.find(item => item.value === event.option.value);
    if (selectedItem && !this.selectedItems().some(item => item.value === selectedItem.value)) {
      this.selectedItems.update(items => [...items, selectedItem]);
      this.announcer.announce(`Added ${selectedItem.label}`);
    }
    this.searchString.set("");
    event.option.deselect();
    this.onSelectedItems.emit(this.selectedItems());
  }

  @Output() onSelectedItems = new EventEmitter<{ label: string; value: string }[]>();
}
