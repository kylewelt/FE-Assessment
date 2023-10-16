import { Component, OnInit } from '@angular/core';

import { Hospital } from '../hospital';
import { HospitalService } from '../hospital.service';

@Component({
  selector: 'app-hospitals',
  templateUrl: './hospitals.component.html',
  styleUrls: ['./hospitals.component.css']
})
export class HospitalsComponent implements OnInit {
  hospitals: Hospital[] = [];
  hospitalName = '';

  constructor(private hospitalService: HospitalService) { }

  ngOnInit(): void {
    this.getHospitals();
  }

  getHospitals(): void {
    this.hospitalService.getHospitals()
      .subscribe(hospitals => this.hospitals = hospitals);
  }

  addHospital(): void {
    const name = this.hospitalName.trim();
    if (!name) { return; }
    this.hospitalService.addHospital({ name } as Hospital)
      .subscribe(hospital => {
        this.hospitals.push(hospital);
      });

      this.hospitalName = '';
  }

  delete(hospital: Hospital): void {
    this.hospitals = this.hospitals.filter(h => h !== hospital);
    this.hospitalService.deleteHospital(hospital.id).subscribe();
  }

}
