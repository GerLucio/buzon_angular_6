import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestableceComponent } from './restablece.component';

describe('RestableceComponent', () => {
  let component: RestableceComponent;
  let fixture: ComponentFixture<RestableceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestableceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestableceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
