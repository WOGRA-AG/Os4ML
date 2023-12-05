import { Component, EventEmitter, Output } from '@angular/core';
import { ContextMenuItemComponent } from '../../molecules/context-menu-item/context-menu-item.component';
import { SolutionCreateButtonComponent } from '../solution-create-button/solution-create-button.component';
import { Databag } from 'build/openapi/modelmanager';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-databag-context-menu',
  templateUrl: './databag-context-menu.component.html',
  styleUrls: ['./databag-context-menu.component.scss'],
  standalone: true,
  imports: [
    ContextMenuItemComponent,
    SolutionCreateButtonComponent,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    TranslateModule,
  ],
})
export class DatabagContextMenuComponent {
  @Output() public settingButton = new EventEmitter<Databag>();
  @Output() public createSolutionButton = new EventEmitter<string>();
}
