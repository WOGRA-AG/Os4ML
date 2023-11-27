import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ContextMenuComponent } from '../../molecules/context-menu/context-menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { Params, RouterLink } from '@angular/router';
import { IconButtonComponent } from '../../molecules/icon-button/icon-button.component';

@Component({
  selector: 'app-solution-context-menu',
  templateUrl: './solution-context-menu.component.html',
  styleUrls: ['./solution-context-menu.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    ContextMenuComponent,
    TranslateModule,
    RouterLink,
    IconButtonComponent,
  ],
})
export class SolutionContextMenuComponent {
  @Output() public createPredictionButton = new EventEmitter<string>();
  @Input() public showPredictionParams: Params = {};
  @Input() public showPredictionLink: string[] | string = [];
  @Input() public showSolutionDetailParams: Params = {};
  @Input() public showSolutionDetailLink: string[] | string | any = [];
}
