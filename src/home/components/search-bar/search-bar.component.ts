import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { BaseComponent } from "../../../app/common/base.component";

@Component({
  selector: "app-search-bar",
  imports: [],
  templateUrl: "./search-bar.component.html",
  styleUrl: "./search-bar.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent extends BaseComponent implements OnInit {
  override title: string = "search-bar";

  ngOnInit() {
    // Search Input Event JS
    const searchInput = document.getElementById("searchInput") as HTMLInputElement;
    const searchIcon = document.querySelector(".search-icon i") as HTMLElement;
    function toggleSearchIcon() {
      if (searchInput && searchIcon) {
        if (searchInput.value) {
          searchIcon.classList.remove("bi-search");
          searchIcon.classList.add("bi-x-lg");
        } else {
          searchIcon.classList.remove("bi-x-lg");
          searchIcon.classList.add("bi-search");
        }
      }
    }

    searchInput.addEventListener("input", toggleSearchIcon);

    searchIcon.addEventListener("click", function () {
      searchInput.value = "";
      searchIcon.classList.remove("bi-x-lg");
      searchIcon.classList.add("bi-search");
      searchInput.focus();
    });
    toggleSearchIcon();
  }
}
