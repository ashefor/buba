import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, TimeoutError } from 'rxjs';
import { GamesService } from '../services/games.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit, OnDestroy {
  ticketDetails: any;
  ticketStatusForm: FormGroup;
  loading: boolean;
  ticketId: any;
  ticketSubscription: Subscription;

  constructor(private fb: FormBuilder,
    private service: GamesService,
    private toastr: ToastrService,  private title: Title, private activatedRoute: ActivatedRoute) {
      this.title.setTitle('Buba | Ticket Status')
     }

  ngOnInit(): void {
    this.initStatusForm();
  }

  initStatusForm() {
    this.ticketStatusForm = this.fb.group({
      ticket_id: [null, [Validators.required]],
    });
  }
  ngOnDestroy() {
    
  }

  get formControls() {
    return this.ticketStatusForm.controls;
  }
 

  checkTicketStatus(formvalue) {
    // tslint:disable-next-line: forin
    for (const i in this.ticketStatusForm.controls) {
      this.ticketStatusForm.controls[i].markAsDirty();
      this.ticketStatusForm.controls[i].updateValueAndValidity();
    }
    if (this.ticketStatusForm.valid) {
      this.loading = true;
      this.ticketDetails = null;
      
      this.ticketStatusForm.disable();
      this.ticketSubscription = this.service.checkTicketStatus(formvalue).subscribe((ticketData: any) => {
        this.ticketStatusForm.enable();
        this.loading = false;
        
        if (ticketData.status === 'success') {
          this.ticketDetails = ticketData;
        } else {
          const badRequestError = ticketData.message;
          this.ticketStatusForm.setErrors({
            badRequest: badRequestError
          });
        }
      }, (error: any) => {
        this.loading = false;
        
        this.ticketStatusForm.enable();
        if (error instanceof HttpErrorResponse) {
          if (error.status === 400) {
            const badRequestError = error.error.message;
            this.ticketStatusForm.setErrors({
              badRequest: badRequestError
            });
          } else {
            this.toastr.error(error.error ? error.error.error : 'An error has occured. Please try again later', 'Error');
          }
        } else if (error instanceof TimeoutError) {
          this.toastr.error('Time Out!', 'Server timeout. Please try again later');
        }
      });
    }
  }
}
