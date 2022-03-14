import {Injectable} from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable} from 'rxjs';
import {Databag, ObjectstoreService} from '../../../build/openapi/objectstore';

@Injectable({
  providedIn: 'root'
})
export class DatabagResolver implements Resolve<Databag[]> {
  constructor(private objectStoreService: ObjectstoreService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Databag[]> {
    return this.objectStoreService.getAllDatabags();
  }
}
