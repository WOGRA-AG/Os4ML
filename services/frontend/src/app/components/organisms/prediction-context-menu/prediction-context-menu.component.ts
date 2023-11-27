import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ContextMenuItemComponent } from '../../molecules/context-menu-item/context-menu-item.component';
import { IconButtonComponent } from '../../molecules/icon-button/icon-button.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-prediction-context-menu',
  templateUrl: './prediction-context-menu.component.html',
  styleUrls: ['./prediction-context-menu.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    ContextMenuItemComponent,
    IconButtonComponent,
    TranslateModule,
  ],
})
export class PredictionContextMenuComponent {
  @Output() public deletePredictionButton = new EventEmitter<string>();
  @Output() public downloadPredictionButton = new EventEmitter<string>();
}
