import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ContextMenuComponent } from '../../molecules/context-menu/context-menu.component';
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
    ContextMenuComponent,
    IconButtonComponent,
    TranslateModule,
  ],
})
export class PredictionContextMenuComponent {
  @Output() public deletePredictionButton = new EventEmitter<string>();
  @Output() public downloadPredictionButton = new EventEmitter<string>();
}
