import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CheckpointRoutingModule } from "./checkpoint-routing.module";

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CheckpointRoutingModule],
})
export class CheckpointModule {}
