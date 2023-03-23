import { Component, EventEmitter, Input, Output } from '@angular/core';
import { urlRegex } from 'src/app/shared/lib/regex/regex';

@Component({
  selector: 'app-dataset-upload',
  templateUrl: './dataset-upload.component.html',
  styleUrls: ['./dataset-upload.component.scss'],
})
export class DatasetUploadComponent {
  @Input() public nameLabel = '';

  @Input() public name: string | undefined = undefined;
  @Output() public nameChange = new EventEmitter<string>();

  @Input() public url: string | undefined = undefined;
  @Output() public urlChange = new EventEmitter<string>();

  @Input() public file: File = new File([], '');
  @Output() public fileChange = new EventEmitter<File>();

  public urlRegex = urlRegex;

  onFileChange(file: File): void {
    this.file = file;
    this.fileChange.emit(file);
  }
  onUrlChange(url: string | undefined): void {
    this.url = url;
    this.urlChange.emit(url);
  }
  onNameChange(name: string | undefined): void {
    this.name = name;
    this.nameChange.emit(name);
  }
}
