import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TransferLearningModel } from '../../../build/openapi/modelmanager';

@Injectable({
  providedIn: 'root',
})
export class TransferLearningService {
  private readonly _transferLearningModelsSubject$ = new BehaviorSubject<
    TransferLearningModel[]
  >([]);
  constructor() {
    this._transferLearningModelsSubject$.next([
      {
        type: 'text',
        label: 'super text',
        id: 'default-text',
        origin: 'Hugging Face',
      },
      {
        type: 'category',
        label: 'super category',
        id: 'super-category',
        origin: 'Hugging Face',
      },
      {
        type: 'category',
        label: 'mega category',
        id: 'mega-category',
        origin: 'Hugging Face',
      },
      {
        type: 'category',
        label: 'super duper category',
        id: 'super-duper-category',
        origin: 'Hugging Face',
      },
    ]);
  }

  get transferLearningModels$(): Observable<TransferLearningModel[]> {
    return this._transferLearningModelsSubject$.asObservable();
  }
}
