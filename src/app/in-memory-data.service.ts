import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Hospital } from './hospital';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const hospitals = [
      {
          id: 1,
          name: 'Hospital A',
          address: {
              line1: '123 Main St',
              line2: '',
              city: 'Chicago',
              state: 'IL',
              zipCode: '60606'
          },
          rating: 5,
          icon: '../assets/HospitalA.png'
      },{
          id: 2,
          name: 'Hospital B',
          address: {
              line1: '123 Main St',
              line2: '',
              city: 'Chicago',
              state: 'IL',
              zipCode: '60606'
          },
          rating: 1,
          icon: '../assets/HospitalB.png'
      },{
          id: 3,
          name: 'Hospital C',
          address: {
              line1: '123 Main St',
              line2: '',
              city: 'Chicago',
              state: 'IL',
              zipCode: '60606'
          },
          rating: 4,
          icon: '../assets/HospitalC.png'
      },{
          id: 4,
          name: 'Hospital D',
          address: {
              line1: '123 Main St',
              line2: '',
              city: 'Chicago',
              state: 'IL',
              zipCode: '60606'
          },
          rating: 3,
          icon: '../assets/HospitalD.png'
      }
    ];
    return {hospitals};
  }

  // Overrides the genId method to ensure that a hospital always has an id.
  // If the hospitals array is empty,
  // the method below returns the initial number (11).
  // if the hospitals array is not empty, the method below returns the highest
  // hospital id + 1.
  genId(hospitals: Hospital[]): number {
    return hospitals.length > 0 ? Math.max(...hospitals.map(hospital => hospital.id)) + 1 : 11;
  }
}
