import { citaObject, editando } from "./variables.js";
import Notificacion from "./classes/Notificacion.js";
import Cita from "./classes/Cita.js";
import AdminCitas from "./classes/AdminCitas.js";
import { form, inputFormSubmit, nombrePacienteInput, emailInput, fechaInput, sintomasInput, nombrePropietarioInput } from "./selectores.js";

const citas = new AdminCitas();

export function addInputValuesToTheCitaObject(e) {
    citaObject[e.target.name] = e.target.value;
}


export function submitForm(e) {
    e.preventDefault();
    let notificacion;
    if (Object.values(citaObject).some((valor) => valor.trim() === "")) {
      notificacion = new Notificacion({
        texto: "Todos los campos son obligatorios",
        tipo: "error",
      });
      notificacion.mostrar();
      return;
    } else {
      if (editando.value) {
        const { id, paciente, propietario, email, fecha, sintomas } = citaObject;
        const cita = new Cita(id, paciente, propietario, fecha, email, sintomas);
        citas.editar(cita);
        notificacion = new Notificacion({
          texto: "Paciente editado",
        });
        editando.value = false;
        inputFormSubmit.value = "Registrar Paciente";
      } else {
        notificacion = new Notificacion({
          texto: "Paciente agregado correctamente",
        });
        const { paciente, propietario, email, fecha, sintomas } = citaObject;
        const cita = new Cita(
          undefined,
          paciente,
          propietario,
          fecha,
          email,
          sintomas
        );
        console.log(cita);
        citas.add(cita);
      }
      citas.mostrar();
      notificacion.mostrar();
      form.reset();
      reiniciarCitaObject();
    }
}

export function reiniciarCitaObject() {
    // citaObject.paciente ='';
    // citaObject.propietario= '';
    // citaObject.email = '';
    // citaObject.fecha='';
    // citaObject.sintomas= '';
  
    //otra forma de reiniciar el objeto
    Object.assign(citaObject, {
      paciente: "",
      propietario: "",
      email: "",
      fecha: "",
      sintomas: "",
    });
}
  
export function generarId() {
    return Math.random().toString(26).substring(2) + Date.now();
}
  
export function cargarEdicion(cita) {
    Object.assign(citaObject, cita);
    nombrePacienteInput.value = cita.paciente;
    nombrePropietarioInput.value = cita.propietario;
    emailInput.value = cita.email;
    fechaInput.value = cita.fecha;
    sintomasInput.value = cita.sintomas;
    editando.value = true;
  
    inputFormSubmit.value = "Guardar Cambios";
}