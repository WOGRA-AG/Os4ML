import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-solution-detail-dependencies',
  templateUrl: './solution-detail-dependencies.component.html',
  styleUrls: ['./solution-detail-dependencies.component.scss'],
  standalone: true,
  imports: [RouterLink, TranslateModule],
})
export class SolutionDetailDependenciesComponent {}
