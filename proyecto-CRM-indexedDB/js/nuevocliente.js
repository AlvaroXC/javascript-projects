(function(){
    let DB;
    const form = document.getElementById('formulario');

    document.addEventListener('DOMContentLoaded', ()=>{
        conectarDB();

    })
    form.addEventListener('submit', validateCliente);

    function validateCliente(e){
        e.preventDefault();
        const nameInput = document.getElementById('nombre').value;
        const emailInput = document.getElementById('email').value;
        const telefonoInput = document.getElementById('telefono').value;
        const empresaInput = document.getElementById('empresa').value;

        if(nameInput==='' || emailInput==='' || telefonoInput==='' ||empresaInput===''){
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return
        }

        const cliente = {
            nombre: nameInput,
            email: emailInput,
            telefono: telefonoInput,
            empresa: empresaInput,
            id: Date.now()
        }

        createCliente(cliente);


    }

    function createCliente(cliente){
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore= transaction.objectStore('crm');
        objectStore.add(cliente);

        transaction.onerror = () => imprimirAlerta('Hubo un error', 'error');

        transaction.oncomplete = () => imprimirAlerta('Cliente agregado correctamente');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    }




})();