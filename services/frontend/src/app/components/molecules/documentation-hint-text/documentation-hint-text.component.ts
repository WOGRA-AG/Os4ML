import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {NewButtonComponent} from "../new-button/new-button.component";

@Component({
  selector: 'app-documentation-hint-text',
  templateUrl: './documentation-hint-text.component.html',
  styleUrls: ['./documentation-hint-text.component.scss'],
  standalone: true,
  imports: [TranslateModule, NewButtonComponent],
})
export class DocumentationHintTextComponent {}
