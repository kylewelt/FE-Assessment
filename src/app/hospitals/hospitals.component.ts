import { Component, OnInit } from '@angular/core';

import { Hospital } from '../hospital';
import { HospitalService } from '../hospital.service';
import { stateList } from '../us-states';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-hospitals',
  templateUrl: './hospitals.component.html',
  styleUrls: ['./hospitals.component.css']
})
export class HospitalsComponent implements OnInit {
  hospitals: Hospital[] = [];
  hospitalName = '';
  hospitalAddressLine1 = '';
  hospitalAddressLine2 = '';
  hospitalAddressCity = '';
  hospitalAddressState = undefined;
  hospitalAddressZipCode = '';
  hospitalRating = 0;

  states = stateList;

  constructor(private hospitalService: HospitalService) { }

  ngOnInit(): void {
    this.getHospitals();
  }

  getHospitals(): void {
    this.hospitalService.getHospitals()
      .subscribe(hospitals => this.hospitals = hospitals);
  }

  isUniqueName(name: string): boolean {
    return this.hospitals.findIndex(h => h.name === name) === -1;
  }

  addHospital(hospitalForm: NgForm): void {
    // trim text input fields
    const name = this.hospitalName?.trim();
    const addressLine1 = this.hospitalAddressLine1?.trim();
    const addressLine2 = this.hospitalAddressLine2?.trim();
    const addressCity = this.hospitalAddressCity?.trim();
    const addressZipCode = this.hospitalAddressZipCode?.trim();
    const rating = Number(this.hospitalRating);

    // check for required text fields
    if (!name || !addressLine1 || !addressCity || !this.hospitalAddressState || !this.hospitalAddressZipCode) { return; }
    
    // check for valid unique name
    if (!this.isUniqueName(name)) {
      hospitalForm.form.controls['new-hospital-name'].setErrors({'incorrect': true});
      return;
    }

    // check for valid zip code
    if (!addressZipCode || !/[0-9]{5}/.test(addressZipCode)) { return; }

    // check for valid hospital rating
    if (isNaN(rating) || rating < 0 || rating > 5) { return; }

    const newHospital = {
      name,
      address: {
        line1: addressLine1,
        line2: addressLine2,
        city: addressCity,
        state: this.hospitalAddressState,
        zipCode: addressZipCode,
      },
      rating,
    };

    this.hospitalService.addHospital({ ...newHospital } as unknown as Hospital)
      .subscribe(hospital => {
        this.hospitals.push(hospital);
      });


      hospitalForm.resetForm();
  }

  delete(hospital: Hospital): void {
    this.hospitals = this.hospitals.filter(h => h !== hospital);
    this.hospitalService.deleteHospital(hospital.id).subscribe();
  }

}
