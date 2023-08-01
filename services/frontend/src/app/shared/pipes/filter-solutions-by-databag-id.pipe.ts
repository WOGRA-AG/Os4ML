import { Pipe, PipeTransform } from '@angular/core';
import { Solution } from '../../../../build/openapi/modelmanager';

@Pipe({
  name: 'filterSolutionsByDatabagId',
  standalone: true,
})
export class FilterSolutionsByDatabagIdPipe implements PipeTransform {
  transform(
    solutions?: Solution[] | null,
    databagId?: string | null
  ): Solution[] {
    if (!solutions) {
      return [];
    }
    if (!databagId) {
      return solutions;
    }
    return solutions.filter(solution => solution.databagId === databagId);
  }
}
