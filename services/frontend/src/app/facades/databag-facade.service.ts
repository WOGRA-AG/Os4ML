import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabagFacade {

  private basePath = 'model-manager.os4ml.svc.cluster.local:8000';
  private url = 'ws://'+ this.basePath + '/apis/v1beta1/model-manager/databags';

  constructor() { }

  connect(): Observable<string> {
    const ws = new WebSocket(this.url);

    return new Observable(subscriber => {
      ws.onmessage = (evt) => {
        subscriber.next(evt.data);
      };
    });
  }
}
