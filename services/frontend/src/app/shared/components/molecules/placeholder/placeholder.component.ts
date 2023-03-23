import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../design/components/atoms/button/button.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-placeholder',
  templateUrl: './placeholder.component.html',
  styleUrls: ['./placeholder.component.scss'],
  standalone: true,
  imports: [NgIf, ButtonComponent, TranslateModule],
})
export class PlaceholderComponent {
  @Input() public imgSrc = '';
  @Input() public imgAlt = '';
  @Input() public title = '';
  @Input() public description = '';
  @Input() public buttonIcon = '';
  @Input() public buttonText = '';

  @Output() public buttonClick = new EventEmitter<void>();
}
