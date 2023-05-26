import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolYearConfigComponent } from './school-year-config.component';

describe('SchoolYearConfigComponent', () => {
  let component: SchoolYearConfigComponent;
  let fixture: ComponentFixture<SchoolYearConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchoolYearConfigComponent]
    });
    fixture = TestBed.createComponent(SchoolYearConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
