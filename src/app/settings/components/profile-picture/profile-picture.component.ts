import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, TimeoutError } from 'rxjs';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss']
})
export class ProfilePictureComponent implements OnInit {
  selectedFile: File;
  loading: boolean;
  badRequestError: any;
  url;
  addIdCardSubscription = new Subscription();

   constructor(private profileService: ProfileService,
               private toastr: ToastrService,
               private loadingBar: LoadingBarService, private title: Title) {
    this.title.setTitle('Buba - Account Add Id');
   }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.loadingBar.stop();
    this.addIdCardSubscription.unsubscribe();
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (e) => { // called once readAsDataURL is completed
        this.url = e.target.result;
      };
    }
    console.log(this.selectedFile);
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
   // console.log(this.selectedFile);
   this.loading = true;
   this.loadingBar.start();
   this.profileService.changeProfilePicture(uploadData).subscribe((idCardData: any) => {
     this.loadingBar.stop();
     this.loading = false;
     // console.log(idCardData);
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
         // console.log(error.error);
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
