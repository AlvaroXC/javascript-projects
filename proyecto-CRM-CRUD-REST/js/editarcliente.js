import { getCustomerById, updateCustomer } from "./API.js";
import {validateObject} from './funciones.js'

(function(){

    const nameInput = document.getElementById('nombre'); 
    const emailInput = document.getElementById('email'); 
    const phoneInput = document.getElementById('telefono'); 
    const bussinesInput = document.getElementById('empresa'); 
    const idInput = document.getElementById('id'); 


    document.addEventListener('DOMContentLoaded', async () =>{
        const parameters = new URLSearchParams(window.location.search);
        const idCustomer = parameters.get('id'); 
        const customer = await getCustomerById(idCustomer);
        
        addCustomerDataToTheForm(customer); 
        
        const form = document.getElementById('formulario');
        form.addEventListener('submit', validateCustomer)
    })

    function addCustomerDataToTheForm(customer){
        const {name, phone, bussines, email, id} = customer; 
        nameInput.value = name; 
        phoneInput.value = phone;
        bussinesInput.value = bussines; 
        emailInput.value = email; 
        idInput.value = id; 
    }

    function validateCustomer(e){
        e.preventDefault(); 

        const clienteObj = {
            name: nameInput.value, 
            email: emailInput.value, 
            phone: phoneInput.value, 
            bussines: bussinesInput.value, 
            id: idInput.value
        }

        if(validateObject(clienteObj)){
            showAlert('Todos los campos son obligatorios');
            return;
        }else{
            updateCustomer(clienteObj)
        }
    }


})();