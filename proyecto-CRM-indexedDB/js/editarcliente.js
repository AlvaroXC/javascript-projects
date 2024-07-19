(function () {

    let DB;
    let idCliente;
    const nameInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const telefonoInput = document.getElementById('telefono');
    const empresaInput = document.getElementById('empresa');
    const form = document.getElementById('formulario');
    
    document.addEventListener("DOMContentLoaded", () => {

        conectarDB();
        
        form.addEventListener('submit', actualizarCliente);

        const parametros = new URLSearchParams(window.location.search);

        idCliente = parametros.get("id");

        if (idCliente) {
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 1000);
        }
    });

    function obtenerCliente(id){
        const transaction = DB.transaction(['crm'], 'readwrite')
        const objectStore = transaction.objectStore('crm');
        const request = objectStore.openCursor();
        request.onsuccess = function(e){
            const cursor = e.target.result;
            if(cursor){
                if(cursor.value.id === Number(id)){
                    llenarFormulario(cursor.value)
                }else{
                    cursor.continue();

                }
            }
        }
    }

    function llenarFormulario(cliente){
        const {nombre, email, telefono, empresa} = cliente;
        nameInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    }

    function actualizarCliente(e){
        e.preventDefault();
        if(nameInput==='' || emailInput==='' || telefonoInput==='' ||empresaInput===''){
            imprimirAlerta('Todos los campos son obligatorios', 'error');
        }

        const clienteActualizado = {
            nombre: nameInput.value,
            email: emailInput.value,
            empresa: empresaInput.value,
            telefono: telefonoInput.value,
            id: Number(idCliente)
        }

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        objectStore.put(clienteActualizado);

        transaction.oncomplete = function(){
            imprimirAlerta('Cliente actualizado');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }

        transaction.onerror = function(){
            imprimirAlerta('Error al actulizar el cliente', 'error');
        }
    }

    function conectarDB(){
        const openConnection  = window.indexedDB.open('crm', 1);
        openConnection.onerror = function(){
            console.log('Hubo un error');
        }
    
        openConnection.onsuccess = function(){
            DB = openConnection.result;
        }
    }
    
})();
