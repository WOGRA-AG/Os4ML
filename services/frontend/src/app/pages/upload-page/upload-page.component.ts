import {Component} from '@angular/core';
import {ObjectstoreService} from "../../../../build/openapi/objectstore";
import {catchError, concatMap, firstValueFrom, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Bucket} from "../../../../build/openapi/objectstore";
import {Router} from "@angular/router";

@Component({
  selector: 'app-upload-page',
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.scss']
})
export class UploadPageComponent {
  file: File = new File([], "");
  bucketName: string = "os4ml";

  constructor(private objectStoreService: ObjectstoreService, private http: HttpClient, private router: Router) {
  }

  // async updateFile(file: File) {
  //   const buckets: Bucket[] = await firstValueFrom(this.objectStoreService.getAllBuckets());
  //   if (!buckets.some(bucket => bucket.name === this.bucketName)) {
  //     await firstValueFrom(this.objectStoreService.postNewBucket(this.bucketName));
  //   }
  //   this.file = file;
  //   try {
  //     await firstValueFrom(this.objectStoreService.putObjectByName(this.bucketName, file.name, file));
  //     await this.router.navigate(['/report']);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
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
      ).subscribe(() => this.router.navigate(['report']));
  }
}
