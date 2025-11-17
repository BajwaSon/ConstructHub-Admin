/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Signal,
  SimpleChanges,
  ViewChild,
  WritableSignal,
  computed,
  signal,
  OnDestroy,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";

@Component({
  selector: "app-autocomplete-search",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./autocomplete-search.component.html",
  styleUrl: "./autocomplete-search.component.scss",
})
export class AutocompleteSearchComponent implements OnInit, OnChanges, OnDestroy {
  @Output() choose = new EventEmitter();

  searchString: WritableSignal<string> = signal("");
  selectText = "";
  focused: WritableSignal<boolean> = signal(false);

  @Input() options = [];
  @Input() filterFunction = () => {
    if (this.searchString()) {
      return this.fullList().filter(item => item.label.toLowerCase().includes(this.searchString().toLowerCase()));
    }

    if (this.focused()) {
      return this.fullList();
    }
    return [];
  };

  @Input() clearOnSelect = false;
  @Input() clearInput = new EventEmitter();
  clearInputSubscription = new Subscription();

  fullList: WritableSignal<{ label: string; value: any }[]> = signal([]);
  list: Signal<{ label: string; value: any }[]> = computed(this.filterFunction.bind(this));

  @ViewChild("searchList", { static: true })
  searchList!: ElementRef;

  constructor() {}

  ngOnInit(): void {
    this.fullList.set(this.options);
    this.clearInput.subscribe(() => {
      this.selectText = "";
    });
  }

  ngOnDestroy() {
    this.clearInputSubscription.unsubscribe();
  }

  onSearch() {
    if (this.searchString()) {
      this.setMaxHeight();
    }
  }

  setMaxHeight() {
    const contentElement = this.searchList.nativeElement;
    const windowHeight = window.innerHeight;
    const contentTop = contentElement.getBoundingClientRect().top;
    const maxHeight = windowHeight - contentTop;
    contentElement.style.maxHeight = maxHeight - 30 + "px";
  }

  onSelect(option: { label: string; value: any }) {
    this.searchString.set("");
    if (!this.clearOnSelect) {
      this.selectText = option.label;
    }
    this.choose.emit(option.value);
  }

  onFocus() {
    this.focused.set(true);
  }

  onBlur() {
    setTimeout(() => {
      this.focused.set(false);
    }, 500);
  }

  clearSelection() {
    this.searchString.set("");
    this.selectText = "";
    this.choose.emit(null);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["options"]) {
      this.fullList.set(this.options);
    }
  }
}
