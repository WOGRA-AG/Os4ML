import { Pipe, PipeTransform } from '@angular/core';
import { Solution } from '../../../build/openapi/modelmanager';
import { SolutionService } from '../services/solution.service';

@Pipe({
  name: 'getSolutionById',
  standalone: true,
})
export class GetSolutionByIdPipe implements PipeTransform {
  constructor(private solutionService: SolutionService) {}
  transform(id: string): Solution | undefined {
    return this.solutionService.getSolutionById(id);
  }
}
