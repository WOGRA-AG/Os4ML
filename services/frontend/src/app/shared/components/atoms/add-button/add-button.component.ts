import {Component, Input} from '@angular/core';
import {ButtonType, UIThemePalette} from '../../../../core/types/button-types';

@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
})
export class AddButtonComponent {
  @Input() color: UIThemePalette = 'primary';
  @Input() type: ButtonType = 'submit';
}
