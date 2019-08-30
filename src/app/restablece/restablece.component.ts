import { Component, OnInit, HostListener } from '@angular/core';
import { Usuario } from "../templates/usuario";
import { HttpClient } from '@angular/common/http';
import { Servidor } from "../templates/servidor";
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-restablece',
  templateUrl: './restablece.component.html',
  styleUrls: ['./restablece.component.css']
})
export class RestableceComponent implements OnInit {
  token: string;
  tamano_pantalla: any;
  contrasenas: any = {};
  servidor = new Servidor();

  ver_password1: boolean;
  ver_password2: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      this.token = params['t'];
    });
  }

  ngOnInit() {
    this.tamano_pantalla = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.tamano_pantalla = window.innerWidth;
  }

  verPassword1() {
    if (this.ver_password1)
      this.ver_password1 = false;
    else
      this.ver_password1 = true;
  }

  verPassword2() {
    if (this.ver_password2)
      this.ver_password2 = false;
    else
      this.ver_password2 = true;
  }

  cambiaPassword(){
    Swal.fire({
      type: 'info',
      title: 'Enviando petición',
      text: 'Espera un momento por favor',
      showConfirmButton: false,
      allowOutsideClick: false
    });
    this.http.post(this.servidor.ip + '/buzon_backend/restablecePassword.php', JSON.stringify({
      tkn: this.token, contrasenas: this.contrasenas
    }), {
      }).subscribe(res => {
        if (res['Error']) {
          Swal.fire({
            type: 'error',
            title: 'ERROR',
            text: res['Error'],
            timer: 5000
          });
        }
        else {
          Swal.fire({
            type: 'success',
            title: 'ÉXITO',
            text: res['Exito'],
            timer: 5000
          });
          setTimeout(() => { this.router.navigate(['/login']); }, 5000);
        }
      });
  }


}
