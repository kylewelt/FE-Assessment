import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterModule} from '@angular/router';
import {of} from 'rxjs';

import {HospitalSearchComponent} from '../hospital-search/hospital-search.component';
import {HospitalService} from '../hospital.service';
import {HOSPITAL} from '../mock-hospitals';

import {DashboardComponent} from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let hospitalService;
  let getHospitalsSpy: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    hospitalService = jasmine.createSpyObj('HospitalService', ['getHospitals']);
    getHospitalsSpy = hospitalService.getHospitals.and.returnValue(of(HOSPITAL));
    TestBed
        .configureTestingModule({
          declarations: [DashboardComponent, HospitalSearchComponent],
          imports: [RouterModule.forRoot([])],
          providers: [
            {provide: HospitalService, useValue: hospitalService},
          ]
        })
        .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Top Hospitals" as headline', () => {
    expect(fixture.nativeElement.querySelector('h2').textContent).toEqual('Top Hospitals');
  });

  it('should call hospitalService', waitForAsync(() => {
    expect(getHospitalsSpy.calls.any()).toBe(true);
  }));

  it('should display 4 links', waitForAsync(() => {
    expect(fixture.nativeElement.querySelectorAll('a').length).toEqual(3);
  }));
});
