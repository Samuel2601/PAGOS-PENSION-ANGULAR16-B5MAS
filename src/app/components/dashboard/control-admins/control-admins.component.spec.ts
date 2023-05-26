import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlAdminsComponent } from './control-admins.component';

describe('ControlAdminsComponent', () => {
  let component: ControlAdminsComponent;
  let fixture: ComponentFixture<ControlAdminsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ControlAdminsComponent]
    });
    fixture = TestBed.createComponent(ControlAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
