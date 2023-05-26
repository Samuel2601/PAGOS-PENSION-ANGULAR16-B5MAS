import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StundesPaymentsComponent } from './stundes-payments.component';

describe('StundesPaymentsComponent', () => {
  let component: StundesPaymentsComponent;
  let fixture: ComponentFixture<StundesPaymentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StundesPaymentsComponent]
    });
    fixture = TestBed.createComponent(StundesPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
