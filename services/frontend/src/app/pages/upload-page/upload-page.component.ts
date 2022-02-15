import {Component} from '@angular/core';
import {ObjectstoreService} from "../../../../build/openapi/objectstore";
import {concatMap, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-upload-page',
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.scss']
})
export class UploadPageComponent {
  bucketName: string = "os4ml";

  constructor(private objectStoreService: ObjectstoreService, private http: HttpClient, private router: Router) {
  }

  updateFile(file: File) {
    this.objectStoreService.getAllBuckets()
      .pipe(
        concatMap(buckets => {
            let bucket;
            if (!!buckets && buckets.length > 0) {
              bucket = buckets.find(b => b.name = this.bucketName);
            }
            if (!bucket) {
              return this.objectStoreService.postNewBucket(this.bucketName)
                .pipe(bucket => bucket)
            } else {
              return of(bucket);
            }
          }
        ),
        concatMap(bucket => this.objectStoreService.putObjectByName(this.bucketName, file.name, file))
      ).subscribe(() => this.router.navigate(['solver']));
  }
}
