import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Solution } from '../../../../../build/openapi/modelmanager';
import { SelectComponent } from '../../molecules/select/select.component';
import { TranslateModule } from '@ngx-translate/core';
import { ToSelectOptionPipe } from '../../../pipes/to-select-option.pipe';

@Component({
  selector: 'app-solution-filter',
  templateUrl: './solution-filter.component.html',
  styleUrls: ['./solution-filter.component.scss'],
  standalone: true,
  imports: [SelectComponent, TranslateModule, ToSelectOptionPipe],
})
export class SolutionFilterComponent {
  @Input() public solutions: Solution[] = [];
  @Input() public defaultValue?: string;
  @Output() public solutionChange = new EventEmitter<string>();

  onSolutionChange(solutionId: string): void {
    this.solutionChange.emit(solutionId);
  }

  public getSolutionId(solution: Solution): string {
    return solution.id ?? '';
  }

  public getSolutionName(solution: Solution): string {
    return solution.name ?? '';
  }
}
