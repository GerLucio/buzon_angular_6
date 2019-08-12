import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoSugerenciasComponent } from './catalogo-sugerencias.component';

describe('CatalogoSugerenciasComponent', () => {
  let component: CatalogoSugerenciasComponent;
  let fixture: ComponentFixture<CatalogoSugerenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogoSugerenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoSugerenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
