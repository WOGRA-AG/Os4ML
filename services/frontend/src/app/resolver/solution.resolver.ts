import {Injectable} from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, of} from 'rxjs';
import {Solution} from '../../../build/openapi/objectstore';

@Injectable({
  providedIn: 'root'
})
export class SolutionResolver implements Resolve<Solution[]> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Solution[]> {
    return of([]);
  }
}
