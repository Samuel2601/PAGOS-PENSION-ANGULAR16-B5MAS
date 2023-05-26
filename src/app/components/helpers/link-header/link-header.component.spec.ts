import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkHeaderComponent } from './link-header.component';

describe('LinkHeaderComponent', () => {
  let component: LinkHeaderComponent;
  let fixture: ComponentFixture<LinkHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkHeaderComponent]
    });
    fixture = TestBed.createComponent(LinkHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
