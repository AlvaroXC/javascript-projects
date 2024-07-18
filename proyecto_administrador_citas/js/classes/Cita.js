import { generarId } from "../funciones.js";

export default class Cita {
    constructor(id = generarId(), paciente, propietario, fecha, email, sintomas) {
      this.id = id;
      this.paciente = paciente;
      this.propietario = propietario;
      this.fecha = fecha;
      (this.email = email), (this.sintomas = sintomas);
    }
}