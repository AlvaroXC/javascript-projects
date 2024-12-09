import {nombrePacienteInput, nombrePropietarioInput, emailInput, fechaInput, sintomasInput, form,} from './selectores.js';
import { addInputValuesToTheCitaObject, submitForm } from "./funciones.js";

nombrePacienteInput.addEventListener("input", addInputValuesToTheCitaObject);
nombrePropietarioInput.addEventListener("input", addInputValuesToTheCitaObject);
emailInput.addEventListener("input", addInputValuesToTheCitaObject);
fechaInput.addEventListener("input", addInputValuesToTheCitaObject);
sintomasInput.addEventListener("input", addInputValuesToTheCitaObject);
form.addEventListener("submit", submitForm);






