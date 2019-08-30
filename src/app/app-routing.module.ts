import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SugerenciasComponent } from './sugerencias/sugerencias.component';
import { AuthGuard } from './guard/auth.guard';
import { LoginComponent } from './login/login.component';
import { PanelComponent } from './panel/panel.component';
import { AdminUsuarioComponent } from './admin-usuario/admin-usuario.component';
import { AreasComponent } from './areas/areas.component';
import { EstadosComponent } from './estados/estados.component';
import { PrioridadesComponent } from './prioridades/prioridades.component';
import { RelacionesComponent } from './relaciones/relaciones.component';
import { CatalogoSugerenciasComponent } from './catalogo-sugerencias/catalogo-sugerencias.component';
import { GraficosComponent } from './graficos/graficos.component';
import { NivelEducativoComponent } from './nivel-educativo/nivel-educativo.component';
import { UnidadesAcademicasComponent } from './unidades-academicas/unidades-academicas.component';
import { TipoUsuarioComponent } from './tipo-usuario/tipo-usuario.component';
import { AdminSugerenciasComponent } from './admin-sugerencias/admin-sugerencias.component';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';
import { DireccionComponent } from './direccion/direccion.component';
import { RestableceComponent } from './restablece/restablece.component';

const routes: Routes = [
  {
    path: 'sugerencias',
    component: SugerenciasComponent,
    data: { title: 'Sugerencias' }
  },
  {
    path: 'restablece',
    component: RestableceComponent,
    data: { title: 'Restablece' }
  },
  {
    path: 'seguimiento',
    component: SeguimientoComponent,
    data: { title: 'Seguimiento' }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' }
  },
  {
    path: 'panel',
    component: PanelComponent,
    data: { title: 'Panel' },
    canActivate: [AuthGuard]
  },
  {
    path: 'direccion',
    component: DireccionComponent,
    data: { title: 'Dirección' },
    canActivate: [AuthGuard]
  },
  {
    path: 'administracion_sugerencias',
    component: AdminSugerenciasComponent,
    data: { title: 'Administración de Sugerencias' },
    canActivate: [AuthGuard]
  },
  {
    path: 'admin_usuario',
    component: AdminUsuarioComponent,
    data: { title: 'Administración Usuario' },
    canActivate: [AuthGuard]
  },
  {
    path: 'areas',
    component: AreasComponent,
    data: { title: 'Administración Áreas' },
    canActivate: [AuthGuard]
  },
  {
    path: 'estados',
    component: EstadosComponent,
    data: { title: 'Administración Estados' },
    canActivate: [AuthGuard]
  },
  {
    path: 'prioridades',
    component: PrioridadesComponent,
    data: { title: 'Administración Prioridades' },
    canActivate: [AuthGuard]
  },
  {
    path: 'relaciones',
    component: RelacionesComponent,
    data: { title: 'Administración relaciones' },
    canActivate: [AuthGuard]
  },
  {
    path: 'catalogo_sugerencias',
    component: CatalogoSugerenciasComponent,
    data: { title: 'Administración Sugerencias' },
    canActivate: [AuthGuard]
  },
  {
    path: 'graficos',
    component: GraficosComponent,
    data: { title: 'Gráficos' },
    canActivate: [AuthGuard]
  },
  {
    path: 'nivel_educativo',
    component: NivelEducativoComponent,
    data: { title: 'Niveles Educativos' },
    canActivate: [AuthGuard]
  },
  {
    path: 'unidades_academicas',
    component: UnidadesAcademicasComponent,
    data: { title: 'Unidades Académicas' },
    canActivate: [AuthGuard]
  },
  {
    path: 'tipo_usuario',
    component: TipoUsuarioComponent,
    data: { title: 'Tipos de Usuario' },
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'sugerencias' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
