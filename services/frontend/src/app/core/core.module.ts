import { NgModule } from '@angular/core';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import {SharedModule} from '../shared/shared.module';



@NgModule({
    declarations: [
        PageNotFoundComponent
    ],
    exports: [
        PageNotFoundComponent
    ],
  imports: [
    SharedModule,
  ]
})
export class CoreModule { }
