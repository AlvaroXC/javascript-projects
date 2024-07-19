const form = document.getElementById('formulario');

function conectarDB(){
    const openConnection  = window.indexedDB.open('crm', 1);
    openConnection.onerror = function(){
        console.log('Hubo un error');
    }

    openConnection.onsuccess = function(){
        DB = openConnection.result;
    }
}

function imprimirAlerta(mensaje, tipo){
    const alerta = document.querySelector('.alerta');
    if(!alerta){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta');
        if(tipo==='error'){
            divMensaje.classList.add('bg-red-100','border-red-400', 'text-red-700')
        }else{
            divMensaje.classList.add('bg-gren-100', 'border-green-400', 'text-green-700');
        }
        divMensaje.textContent= mensaje;
        form.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);

    }

}