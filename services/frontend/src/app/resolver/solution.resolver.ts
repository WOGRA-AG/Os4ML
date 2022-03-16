import {Injectable} from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable} from 'rxjs';
import {Solution} from '../../../build/openapi/jobmanager';
import {ObjectstoreService} from '../../../build/openapi/objectstore';

@Injectable({
  providedIn: 'root'
})
export class SolutionResolver implements Resolve<Solution[]> {
  constructor(private objectstoreService: ObjectstoreService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Solution[]> {
    return this.objectstoreService.getAllSolutions();
  }
}
