import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BidService } from '../makebid/services/bid.service';

@Component({
  selector: 'app-verify-payment',
  templateUrl: './verify-payment.component.html',
  styleUrls: ['./verify-payment.component.scss']
})
export class VerifyPaymentComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, private bidService: BidService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((data: any) => {
      this.bidService.verifyFlutterwave(data).subscribe((res: any) => {
        this.router.navigateByUrl(res.return_url);
        if (res.status !== 'error') {
          this.toastr.success(res.message);
        } else {
          this.toastr.error(res.message);
        }
      }, (err: any) => {
        if (err.status === 400) {
          this.router.navigateByUrl(err.return_url);
          this.toastr.error(err.error.message);
        }
      });
    });
  }

}
