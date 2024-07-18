const nombrePacienteInput = document.getElementById("paciente");
const nombrePropietarioInput = document.getElementById("propietario");
const emailInput = document.getElementById("email");
const fechaInput = document.getElementById("fecha");
const sintomasInput = document.getElementById("sintomas");
const contenedorCitas = document.getElementById("citas");

const form = document.getElementById("formulario-cita");
const inputFormSubmit = document.querySelector(
  '#formulario-cita input[type="submit"]'
);
let editando = false;

const citaObject = {
  paciente: "",
  propietario: "",
  email: "",
  fecha: "",
  sintomas: "",
};

nombrePacienteInput.addEventListener("input", addInputValuesToTheCitaObject);
nombrePropietarioInput.addEventListener("input", addInputValuesToTheCitaObject);
emailInput.addEventListener("input", addInputValuesToTheCitaObject);
fechaInput.addEventListener("input", addInputValuesToTheCitaObject);
sintomasInput.addEventListener("input", addInputValuesToTheCitaObject);

form.addEventListener("submit", submitForm);

class Notificacion {
  constructor({ texto, tipo }) {
    this.texto = texto;
    this.tipo = tipo;
  }

  mostrar() {
    const alerta = document.createElement("div");
    alerta.classList.add(
      "text-center",
      "w-full",
      "p-3",
      "text-white",
      "my-5",
      "alert",
      "uppercase",
      "font-bold",
      "text-sm"
    );

    const alertaPrevia = document.querySelector(".alert");
    if (alertaPrevia) {
      alertaPrevia.remove();
    }

    this.tipo === "error"
      ? alerta.classList.add("bg-red-500")
      : alerta.classList.add("bg-green-500");

    alerta.textContent = this.texto;

    form.parentElement.insertBefore(alerta, form);

    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

class Cita {
  constructor(id = generarId(), paciente, propietario, fecha, email, sintomas) {
    this.id = id;
    this.paciente = paciente;
    this.propietario = propietario;
    this.fecha = fecha;
    (this.email = email), (this.sintomas = sintomas);
  }
}

class AdminCitas {
  constructor() {
    this.citas = [];
  }

  add(cita) {
    this.citas.push(cita);
  }

  editar(citaActualizada) {
    this.citas = this.citas.map((cita) =>
      cita.id === citaActualizada.id ? citaActualizada : cita
    );
    console.log(citas);
  }

  eliminar(id) {
    this.citas.filter( cita => cita.id !== id);
    this.mostrar();
  }
  mostrar() {
    while (contenedorCitas.hasChildNodes()) {
      contenedorCitas.removeChild(contenedorCitas.firstChild);
    }

    if(this.citas.length == 0){
        contenedorCitas.innerHTML = '<p class="text-xl mt-5 mb-10 text-center">No Hay Pacientes</p>'
        return;
    }

    this.citas.forEach((cita) => {
      const divCita = document.createElement("div");
      divCita.classList.add(
        "mx-5",
        "my-10",
        "bg-white",
        "shadow-md",
        "px-5",
        "py-10",
        "rounded-xl",
        "p-3"
      );

      const paciente = document.createElement("p");
      paciente.classList.add(
        "font-normal",
        "mb-3",
        "text-gray-700",
        "normal-case"
      );
      paciente.innerHTML = `<span class="font-bold uppercase">Paciente: </span> ${cita.paciente}`;

      const propietario = document.createElement("p");
      propietario.classList.add(
        "font-normal",
        "mb-3",
        "text-gray-700",
        "normal-case"
      );
      propietario.innerHTML = `<span class="font-bold uppercase">Propietario: </span> ${cita.propietario}`;

      const email = document.createElement("p");
      email.classList.add(
        "font-normal",
        "mb-3",
        "text-gray-700",
        "normal-case"
      );
      email.innerHTML = `<span class="font-bold uppercase">E-mail: </span> ${cita.email}`;

      const fecha = document.createElement("p");
      fecha.classList.add(
        "font-normal",
        "mb-3",
        "text-gray-700",
        "normal-case"
      );
      fecha.innerHTML = `<span class="font-bold uppercase">Fecha: </span> ${cita.fecha}`;

      const sintomas = document.createElement("p");
      sintomas.classList.add(
        "font-normal",
        "mb-3",
        "text-gray-700",
        "normal-case"
      );
      sintomas.innerHTML = `<span class="font-bold uppercase">Síntomas: </span> ${cita.sintomas}`;

      const btnEditar = document.createElement("button");
      btnEditar.classList.add(
        "py-2",
        "px-10",
        "bg-indigo-600",
        "hover:bg-indigo-700",
        "text-white",
        "font-bold",
        "uppercase",
        "rounded-lg",
        "flex",
        "items-center",
        "gap-2",
        "btn-editar"
      );
      btnEditar.innerHTML =
        'Editar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';

      btnEditar.onclick = () => cargarEdicion(cita);

      const btnEliminar = document.createElement("button");
      btnEliminar.classList.add(
        "py-2",
        "px-10",
        "bg-red-600",
        "hover:bg-red-700",
        "text-white",
        "font-bold",
        "uppercase",
        "rounded-lg",
        "flex",
        "items-center",
        "gap-2"
      );
      btnEliminar.innerHTML =
        'Eliminar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';

      btnEliminar.onclick = () => this.eliminar(cita.id);
      const contenedorBotones = document.createElement("div");
      contenedorBotones.classList.add("flex", "justify-between", "mt-10");
      contenedorBotones.appendChild(btnEditar);
      contenedorBotones.appendChild(btnEliminar);

      // Agregar al HTML
      divCita.appendChild(paciente);
      divCita.appendChild(propietario);
      divCita.appendChild(email);
      divCita.appendChild(fecha);
      divCita.appendChild(sintomas);
      divCita.appendChild(contenedorBotones);
      contenedorCitas.appendChild(divCita);
    });
  }
}

function addInputValuesToTheCitaObject(e) {
  citaObject[e.target.name] = e.target.value;
}

const citas = new AdminCitas();

function submitForm(e) {
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
    if (editando) {
      const { id, paciente, propietario, email, fecha, sintomas } = citaObject;
      const cita = new Cita(id, paciente, propietario, fecha, email, sintomas);
      citas.editar(cita);
      notificacion = new Notificacion({
        texto: "Paciente editado",
      });
      editando = false;
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
      citas.add(cita);
    }
    citas.mostrar();
    notificacion.mostrar();
    form.reset();
    reiniciarCitaObject();
    console.log(citaObject);
  }
}

function reiniciarCitaObject() {
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

function generarId() {
  return Math.random().toString(26).substring(2) + Date.now();
}

function cargarEdicion(cita) {
  Object.assign(citaObject, cita);
  nombrePacienteInput.value = cita.paciente;
  nombrePropietarioInput.value = cita.propietario;
  emailInput.value = cita.email;
  fechaInput.value = cita.fecha;
  sintomasInput.value = cita.sintomas;
  editando = true;

  inputFormSubmit.value = "Guardar Cambios";
}
