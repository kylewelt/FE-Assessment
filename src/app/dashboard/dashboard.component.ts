import { Component, OnInit } from '@angular/core';
import { Hospital } from '../hospital';
import { HospitalService } from '../hospital.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  hospitals: Hospital[] = [];

  constructor(private hospitalService: HospitalService) {}

  ngOnInit(): void {
    this.getHospitals();
  }

  getHospitals(): void {
    this.hospitalService.getHospitals().subscribe((hospitals) => {
      let sortedHospitals = hospitals.sort((a, b) => b.rating - a.rating);
      let topHospitals = sortedHospitals.slice(0, 3);
      
      this.hospitals = topHospitals;
    });
  }
}
