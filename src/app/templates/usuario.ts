export class Usuario {
    constructor(
      public id_usuario?: number,
      public nombre?: string,
      public apellidos?: string,
      public correo?: string,
      public password?: string,
      public rol?: string,
      public area_asignacion?: string
    ) { }
  }