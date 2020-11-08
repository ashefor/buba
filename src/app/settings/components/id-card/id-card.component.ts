import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, TimeoutError } from 'rxjs';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-id-card',
  templateUrl: './id-card.component.html',
  styleUrls: ['./id-card.component.scss']
})
export class IdCardComponent implements OnInit, OnDestroy {
  selectedFile: File;
  loading: boolean;
  badRequestError: any;
  addIdCardSubscription = new Subscription();
  constructor(private profileService: ProfileService, private toastr: ToastrService, private loadingBar: LoadingBarService) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.loadingBar.stop();
    this.addIdCardSubscription.unsubscribe();
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
  }

  clearFileUpload(file: HTMLInputElement) {
    this.selectedFile = null;
    file.value = null;
  }

  onUpload(file: HTMLInputElement) {
   if (!this.selectedFile) {
     return;
   }
   const uploadData = new FormData();
   uploadData.append('file', this.selectedFile, this.selectedFile.name);
   console.log(this.selectedFile);
   this.loading = true;
   this.loadingBar.start();
   this.addIdCardSubscription = this.profileService.uploadIdCardDetails(uploadData).subscribe((idCardData: any) => {
     this.loadingBar.stop();
     this.loading = false;
     console.log(idCardData);
     if (idCardData.status === 'success') {
       this.toastr.success('Success', idCardData.message);
       this.clearFileUpload(file);
     } else {
       this.toastr.error('Error!', idCardData.message);
     }
   }, (error: any) => {
     this.loading = false;
     this.loadingBar.stop();
     console.log(error);
     if (error instanceof HttpErrorResponse) {
       if (error.status === 400) {
         console.log(error.error);
         this.badRequestError = error.error.message;
       } else {
         this.toastr.error(error.error ? error.error.error : 'An error has occured. Please try again later', 'Error');
       }
     } else if (error instanceof TimeoutError) {
       this.toastr.error('Time Out!', 'Server timeout. Please try again later');
     }
   });
  }
}
