import {Injectable} from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable} from 'rxjs';
import {JobmanagerService, Solution} from '../../../build/openapi/jobmanager';

@Injectable({
  providedIn: 'root'
})
export class SolutionResolver implements Resolve<Solution[]> {
  constructor(private jobmanagerService: JobmanagerService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Solution[]> {
    return this.jobmanagerService.getAllSolutions();
  }
}
