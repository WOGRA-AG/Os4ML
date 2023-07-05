import { Pipe, PipeTransform } from '@angular/core';
import { Solution } from '../../../../build/openapi/modelmanager';

@Pipe({
  name: 'getSolutionById',
  standalone: true,
})
export class GetSolutionByIdPipe implements PipeTransform {
  transform(solutions: Solution[] | null, id: string): Solution | undefined {
    if (!solutions) {
      return undefined;
    }
    return solutions.find(solution => solution.id === id);
  }
}
