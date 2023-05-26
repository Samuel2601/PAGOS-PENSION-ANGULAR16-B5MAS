import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesAnualComponent } from './sales-anual.component';

describe('SalesAnualComponent', () => {
  let component: SalesAnualComponent;
  let fixture: ComponentFixture<SalesAnualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesAnualComponent]
    });
    fixture = TestBed.createComponent(SalesAnualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
