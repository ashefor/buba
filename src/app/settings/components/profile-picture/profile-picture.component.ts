import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, TimeoutError } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss']
})
export class ProfilePictureComponent implements OnInit, OnDestroy {
  selectedFile: File;
  loading: boolean;
  badRequestError: any;
  url;
  addIdCardSubscription: Subscription;
  user: any;
  imgHasLoaded = false;

   constructor(private profileService: ProfileService,
               private authService: AuthService,
               private toastr: ToastrService,
                private title: Title) {
    this.title.setTitle('Buba - Account Profile Picture');
   }

  ngOnInit(): void {
    this.authService.getUser$().subscribe((user) => {
      this.user = user;
      this.url = `https://api.buba.ng/app/api/uploads/${user?.picture}`;
    });
  }

  ngOnDestroy() {
    
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
  }

  hasLoaded(event) {
    this.imgHasLoaded = true;
  }

  imgOnError() {
    this.url = 'https://api.buba.ng/app/api/uploads/pp.png'
  }
  clearFileUpload(file: HTMLInputElement) {
    this.selectedFile = null;
    this.url = null;
    file.value = null;
  }

  onUpload(file: HTMLInputElement) {
   if (!this.selectedFile) {
     return;
   }
   const uploadData = new FormData();
   uploadData.append('file', this.selectedFile, this.selectedFile.name);
   this.loading = true;
   
   this.profileService.changeProfilePicture(uploadData).subscribe((pictureData: any) => {
     
     this.loading = false;
     if (pictureData.status === 'success') {
       this.toastr.success('Success', 'Picture changed successfully');
       this.user.picture = pictureData.file_name;
       this.authService.storeUser(this.user);
     } else {
       this.toastr.error('Error!', pictureData.message);
     }
   }, (error: any) => {
     this.loading = false;
     
     if (error instanceof HttpErrorResponse) {
       if (error.status === 400) {
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
