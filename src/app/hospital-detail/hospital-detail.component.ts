import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Hospital } from '../hospital';
import { HospitalService } from '../hospital.service';

@Component({
  selector: 'app-hospital-detail',
  templateUrl: './hospital-detail.component.html',
  styleUrls: [ './hospital-detail.component.css' ]
})
export class HospitalDetailComponent implements OnInit {
  hospital: Hospital | undefined;

  constructor(
    private route: ActivatedRoute,
    private hospitalService: HospitalService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getHospital();
  }

  getHospital(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.hospitalService.getHospital(id)
      .subscribe(hospital => this.hospital = hospital);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.hospital) {
      this.hospitalService.updateHospital(this.hospital)
        .subscribe(() => this.goBack());
    }
  }
}
