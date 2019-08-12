import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSugerenciasComponent } from './admin-sugerencias.component';

describe('AdminSugerenciasComponent', () => {
  let component: AdminSugerenciasComponent;
  let fixture: ComponentFixture<AdminSugerenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSugerenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSugerenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
