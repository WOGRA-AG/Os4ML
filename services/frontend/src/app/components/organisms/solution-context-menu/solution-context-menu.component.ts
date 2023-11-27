import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ContextMenuItemComponent } from '../../molecules/context-menu-item/context-menu-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { Params, RouterLink } from '@angular/router';
import { IconButtonComponent } from '../../molecules/icon-button/icon-button.component';
import { NgIf } from '@angular/common';
import { IsSolutionDonePipe } from '../../../pipes/is-solution-done.pipe';
import { Solution } from '../../../../../build/openapi/modelmanager';

@Component({
  selector: 'app-solution-context-menu',
  templateUrl: './solution-context-menu.component.html',
  styleUrls: ['./solution-context-menu.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    ContextMenuItemComponent,
    TranslateModule,
    RouterLink,
    IconButtonComponent,
    NgIf,
    IsSolutionDonePipe,
  ],
})
export class SolutionContextMenuComponent {
  @Output() public createPredictionButton = new EventEmitter<string>();
  @Input() public showPredictionParams: Params = {};
  @Input() public showPredictionLink: string[] | string = [];
  @Input() public showSolutionDetailParams: Params = {};
  @Input() public showSolutionDetailLink: string[] | string | any = [];
  @Input() public solutionElement!: Solution;
}
