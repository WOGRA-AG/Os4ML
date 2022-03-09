import {Injectable} from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolutionResolver implements Resolve<any> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return of([]);
    // return of([{
    //   "name": "Solution1",
    //   "accuracy": 98,
    //   "runtime": "1h 24m",
    //   "precision": "Medium",
    //   "status": "Done",
    //   "input": [],
    //   "output": [],
    //   "solver": []
    // }]);
  }
}
