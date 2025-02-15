import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';


@Pipe({
  name: 'tStoDate',
  standalone: true
})
export class TStoDatePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {

    const fechaRecibida = new Date(value.seconds * 1000 + value.nanoseconds / 1000000)

    return format(fechaRecibida, 'dd/MM/yyyy HH:mm')
  }

  
}