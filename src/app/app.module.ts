import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TokenInterceptor } from './core/interceptors/token-interceptor';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LoadingBarModule,
    ToastrModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
