import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { TimeoutError } from 'rxjs';
import { GamesService } from '../services/games.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  ticketDetails: any;
  ticketStatusForm: FormGroup;
  loading: boolean;
  ticketId: any;

  constructor(private fb: FormBuilder,
    private service: GamesService,
    private toastr: ToastrService, private loadingBar: LoadingBarService, private title: Title, private activatedRoute: ActivatedRoute) {
      this.title.setTitle('Buba | Ticket Status')
     }

  ngOnInit(): void {
    this.initStatusForm();
    this.activatedRoute.queryParams.subscribe((param: Params) => {
        this.ticketId = param.ticket_id;
        this.ticketStatusForm.patchValue({ticket_id: this.ticketId})
        if(this.ticketId) {
          const data = {
            ticket_id: this.ticketId
          }
          this.checkStatus(data);
        }
    })
  }

  initStatusForm() {
    this.ticketStatusForm = this.fb.group({
      ticket_id: [null, [Validators.required]],
    });
  }
  ngOnDestroy() {
    this.loadingBar.stop();
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
      this.loadingBar.start();
      this.ticketStatusForm.disable();
      this.checkStatus(formvalue)
    }
  }

  checkStatus(ticketObj) {
    this.loadingBar.start();
    this.loading = true;
    return this.service.checkTicketStatus(ticketObj).subscribe((ticketData: any) => {
      this.ticketStatusForm.enable();
      this.loading = false;
      this.loadingBar.stop();
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
      this.loadingBar.stop();
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
