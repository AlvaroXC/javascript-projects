import {showAlert, validateObject} from './funciones.js';
import {newCustomer} from './API.js';

/*
    Un IIFE es una función que se ejecuta tan pronto como se define
    
    Se conforma de dos partes, la primera es la función anonima, encerrado por el operador de agrupación (). 
    El operador impide que las variables dentro sean accesibles fuera del IIFE, así como impide la contaminación del alcance que 
    vendría siendo el global. 

    La segunda parte del IIFE es la expresión de la función la cual es ejecutada inmediatamente. 

*/
(function(){
    const form = document.getElementById('formulario');
    form.addEventListener('submit', validateForm); 

    function validateForm(e){
        e.preventDefault();
        
        const nameField = document.getElementById('nombre').value; 
        const emailField = document.getElementById('email').value; 
        const phoneField = document.getElementById('telefono').value; 
        const bussinesField = document.getElementById('empresa').value; 
    
        const clienteObj = {
            name: nameField, 
            email: emailField, 
            phone: phoneField, 
            bussines: bussinesField
        }
    
        if(validateObject(clienteObj)){
            showAlert('Todos los campos son obligatorios');
            return;
        }else{
            newCustomer(clienteObj);
        }

    }


})(); 

