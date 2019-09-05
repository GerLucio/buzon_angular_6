import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { AuthGuard } from './guard';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SugerenciasComponent } from './sugerencias/sugerencias.component';
import { LoginComponent } from './login/login.component';
import { PanelComponent } from './panel/panel.component';
import { AdminUsuarioComponent } from './admin-usuario/admin-usuario.component';
import { AreasComponent } from './areas/areas.component';
import { EstadosComponent } from './estados/estados.component';
import { PrioridadesComponent } from './prioridades/prioridades.component';
import { RelacionesComponent } from './relaciones/relaciones.component';
import { CatalogoSugerenciasComponent } from './catalogo-sugerencias/catalogo-sugerencias.component';
import { GraficosComponent } from './graficos/graficos.component';
import { GrdFilterPipe } from "./grd-filter.pipe";
import { NivelEducativoComponent } from './nivel-educativo/nivel-educativo.component';
import { UnidadesAcademicasComponent } from './unidades-academicas/unidades-academicas.component';
import { TipoUsuarioComponent } from './tipo-usuario/tipo-usuario.component';
import { AdminSugerenciasComponent } from './admin-sugerencias/admin-sugerencias.component';

import { RecaptchaModule } from 'ng-recaptcha';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';
import { DireccionComponent } from './direccion/direccion.component';
import { RestableceComponent } from './restablece/restablece.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SugerenciasComponent,
    LoginComponent,
    PanelComponent,
    AdminUsuarioComponent,
    AreasComponent,
    EstadosComponent,
    PrioridadesComponent,
    RelacionesComponent,
    CatalogoSugerenciasComponent,
    GraficosComponent,
    GrdFilterPipe,
    NivelEducativoComponent,
    UnidadesAcademicasComponent,
    TipoUsuarioComponent,
    AdminSugerenciasComponent,
    SeguimientoComponent,
    DireccionComponent,
    RestableceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RecaptchaModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
