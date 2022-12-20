import {Component, Input} from '@angular/core';
import {ButtonSize, ButtonType, UIThemePalette} from '../../../types';

@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
})
export class AddButtonComponent {
  @Input() color: UIThemePalette = 'primary';
  @Input() type: ButtonType = 'submit';
}
