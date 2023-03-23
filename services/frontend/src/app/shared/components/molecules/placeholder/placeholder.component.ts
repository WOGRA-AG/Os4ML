import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  templateUrl: './placeholder.component.html',
  styleUrls: ['./placeholder.component.scss'],
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
