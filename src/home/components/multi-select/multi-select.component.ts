/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/no-output-on-prefix */
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, inject, model, signal } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent, MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";

@Component({
  selector: "app-multi-select",
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatChipsModule, MatIconModule, MatAutocompleteModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./multi-select.component.html",
  styleUrl: "./multi-select.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectComponent {
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

  isSelected(option: { label: string; value: string | number }): boolean {
    return this.selectedItems().some(item => String(item.value) === String(option.value));
  }

  triggerFormSubmit(event: KeyboardEvent | any) {
    // Only trigger if event exists
    if (event) {
      const form = (event.target as HTMLElement).closest("form");
      if (form) {
        const submitButton = form.querySelector('button[type="submit"]:not(:disabled)') as HTMLButtonElement;
        if (submitButton) {
          submitButton.click();
        }
      }
    }
  }
}
