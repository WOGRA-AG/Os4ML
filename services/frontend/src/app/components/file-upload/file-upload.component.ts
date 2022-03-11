import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  @Input() file: File = new File([], '');
  @Input() uploadProgress = 0;
  @Output() fileChange: EventEmitter<File> = new EventEmitter<File>();
  @Output() cancelUpload: EventEmitter<null> = new EventEmitter<null>();

  uploadFile(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (!fileList) {return;}
    this.file = fileList[0];
    this.fileChange.emit(this.file);
  }

  uploadDroppedFile(files: File[]) {
    if (!files) {return;}
    this.file = files[0];
    this.fileChange.emit(this.file);
  }
}
