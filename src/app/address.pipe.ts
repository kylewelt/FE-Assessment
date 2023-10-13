import { Pipe, PipeTransform } from '@angular/core';
import { Address } from './hospital';

@Pipe({
  name: 'address'
})
export class AddressPipe implements PipeTransform {

  transform(addressObj: Address, ...args: unknown[]): string {
    if (
      addressObj &&
      addressObj.line1 &&
      addressObj.city &&
      addressObj.state &&
      addressObj.zipCode
    ) {
      const { line1, line2, city, state, zipCode } =
        addressObj;
      return `${line1},${
        line2 ? ` ${line2},` : ''
      } ${city}, ${state} ${zipCode}`;
    } else return '';
  }

}
