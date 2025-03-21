(function(){
    let DB;
    const listadoClientes = document.getElementById('listado-clientes');

    document.addEventListener('DOMContentLoaded', ()=>{
        createDB();

        listadoClientes.addEventListener('click', eliminarRegistro);

        if(window.indexedDB.open('crm', 1)){
            obtenerClientes();
        }
    })

    function createDB(){
        const createDB = window.indexedDB.open('crm', 1);
        createDB.onerror = function(){
            console.log('Hubo un error')
        }

        createDB.onsuccess = function(){
            console.log('Base de datos creada')
            DB= createDB.result;
        }

        createDB.onupgradeneeded = function(event){
            const db = event.target.result;

            const objectStore = db.createObjectStore('crm', {
                keyPath: 'id',
                autoIncrement: true
            })

            objectStore.createIndex('nombre', 'nombre', {unique: false});
            objectStore.createIndex('email', 'email', {unique: true});
            objectStore.createIndex('telefono', 'telefono', {unique: false});
            objectStore.createIndex('empresa', 'empresa', {unique: false});
            objectStore.createIndex('id', 'id', {unique: true});
            
            console.log('Bas de datos creada y lista');
        }

        
    }

    function obtenerClientes(){
        const connection = window.indexedDB.open('crm',1);
        connection.onerror = function(){
            console.log('Hubo un error')
        }

        connection.onsuccess = function(){
            DB= connection.result;
            const objectStore = DB.transaction('crm').objectStore('crm');
            objectStore.openCursor().onsuccess = function(e){
                const cursor = e.target.result;
                if(cursor){
                    const {nombre, telefono,email, empresa, id}=cursor.value;
                    listadoClientes.innerHTML += ` 
                    <tr>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                            <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                            <p class="text-gray-700">${telefono}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                            <p class="text-gray-600">${empresa}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                            <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                            <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                        </td>
                    </tr>`;
                    cursor.continue();
                }else{
                    console.log('No hay más registros');
                }
            }
        }
    }

    function eliminarRegistro(e){
        if(e.target.classList.contains('eliminar')){
            const id = Number(e.target.dataset.cliente);
            const confirmar = confirm('¿Deseas eliminar este cliente?')
            if(confirmar){
                const transaction = DB.transaction(['crm'], 'readwrite');
                const objectStore = transaction.objectStore('crm');
                objectStore.delete(id);

                transaction.oncomplete = function(){
                    e.target.parentElement.parentElement.remove();   
                }
            }
            
        }
    }

})();