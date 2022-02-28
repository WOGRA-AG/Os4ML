import {Injectable} from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable} from 'rxjs';
import {Bucket, ObjectstoreService} from "../../../build/openapi/objectstore";

@Injectable({
  providedIn: 'root'
})
export class DatabagResolver implements Resolve<Array<Bucket>> {
  constructor(private objectStoreService: ObjectstoreService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<Bucket>> {
    return this.objectStoreService.getAllBuckets();
  }
}
