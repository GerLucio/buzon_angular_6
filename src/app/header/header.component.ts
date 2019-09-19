import { Component, OnInit, HostListener } from '@angular/core';
import { Usuario } from "../templates/usuario";
import { interval } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  usuario_actual = new Usuario();
  autenticado: boolean = false;
  user: any;
  tamano_pantalla: any;

  constructor(private router: Router) {
    const source = interval(50);
    const subscribe = source.subscribe(val => this.validaUsuario());  
  }

  ngOnInit() {
    this.tamano_pantalla = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.tamano_pantalla = window.innerWidth;
  }

  validaUsuario(){
    var user;
    this.autenticado = JSON.parse(localStorage.getItem('autenticado'));
    if (this.autenticado) {
      user = JSON.parse(localStorage.getItem('usuario'));
      this.usuario_actual.rol = user.rol;
      this.usuario_actual.id_usuario = user.id_usuario;
      this.usuario_actual.nombre = user.nombre;
      this.usuario_actual.apellidos = user.apellidos;
      this.usuario_actual.correo = user.correo;
      this.usuario_actual.area_asignacion = user.area_asignacion;
    }
    else{
      user = null;
      this.usuario_actual = new Usuario();
    }
  }

  expande(){
    if(this.tamano_pantalla < 768){
      var btn = document.getElementById("expand-btn").click();
    }
  }

}
