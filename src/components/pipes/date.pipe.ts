import {Pipe, PipeTransform} from '@angular/core';
import {names} from '../../config/russian-time';

@Pipe({
  name: 'datePipe'
})

export class DatePipeTemplate implements PipeTransform {
  transform(value: Date, args: any[]): any {
    return `${value.getDate()} ${names.monthNamesDate[value.getMonth()]} c ${value.getHours()}:00`;
  }
}
