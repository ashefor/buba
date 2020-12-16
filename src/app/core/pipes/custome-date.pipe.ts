import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'customeDate'
})
export class CustomeDatePipe implements PipeTransform {

  transform(value: any, format: string): any {
    if(value) {
      return moment(value).format(format)
    }
  }

}
