let customerObj = {
    table: '',
    hour: '',
    order: []
}

const categorysObj = {
    1: "Comida",
    2: "Bebidas",
    3: "Postres"
}

const btnSaveCustomer = document.getElementById('guardar-cliente');
btnSaveCustomer.addEventListener('click', saveCustomer);

function saveCustomer(){
    const table = document.getElementById('mesa').value;
    const hour = document.getElementById('hora').value;
    const emptyFields = [table, hour].some( field => field === '' );

    if(emptyFields){

        const existAlert = document.querySelector('.invalid-feedbakc');
        if(!existAlert){
            showAlert('Todos los campos son obligatorios')
            return;
        }
    }

    customerObj.hour = hour;
    customerObj.table = table; 

    const modalForm = document.getElementById('formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalForm);
    modalBootstrap.hide();

    showSections();

    getMeals();

}

function showAlert(message){
    const newAlert = document.createElement('div');
    newAlert.classList.add('invalid-feedback', 'd-block', 'text-center');
    newAlert.textContent = message;
    document.querySelector('.modal-body form').appendChild(newAlert);

    setTimeout(() => {
        newAlert.remove();
    }, 3000);
    
}

function showSections(){
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'));

}

async function getMeals(){
    const url = 'http://localhost:4000/platillos';

    try {
        const response = await fetch(url);
        const data = response.json();
        showMeals(data);
    } catch (error) {
        console.log(error)
    }
}

function showMeals(platillos){
    const contenido = document.querySelector('#platillos .contenido');
    platillos.forEach(platillo => {
        const row = document.createElement('div');
        row.classList.add('row', 'py-3', 'border-top');

        const nombre = document.createElement('div');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre; 

        const precio = document.createElement('div');
        precio.classList.add('col-md-3', 'fw-bold');
        precio.textContent = '$ '+platillo.precio; 


        const categoria = document.createElement('div');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorysObj[platillo.categoria];


        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.id = `producto-${platillo.id}`;
        inputCantidad.classList.add('form-control');
        inputCantidad.value = 0; 
        inputCantidad.onchange = ()=>{
            const cantidad = parseInt(inputCantidad.value); 
            addMeal({...platillo, cantidad})
        }; 

        const agregar = document.createElement('div');
        agregar.classList.add('col-md-2');

        agregar.appendChild(inputCantidad);

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);

        contenido.appendChild(row);


    })
}

function addMeal(producto){


    if(producto.cantidad > 0){
        if(customerObj.order.some( articulo => articulo.id === producto.id )){

            const orderUpdated = customerObj.order.map( articulo => {
                if(articulo.id === producto.id){
                    articulo.cantidad = producto.cantidad;
                }
                return articulo;
            }); 

            customerObj.order = orderUpdated; 

    
        }else{
            customerObj.order.push(producto);
        }
    }else{
        const resultado = customerObj.order.filter( articulo => articulo.id !== producto.id ); 
        customerObj.order = resultado; 
    }

    deleteHTML();

    if(customerObj.order.length !== 0){
        updatePurchaseSummary();
    }else{
        addEmptyOrderMessage();
    }


}

function deleteHTML() {
    const contenido = document.querySelector('#resumen .contenido');
    while(contenido.firstChild){
        contenido.removeChild(contenido.firstChild)
    }
}


function updatePurchaseSummary(){
    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('div');
    resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');

    const mesa = document.createElement('p');
    mesa.textContent= 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('span');
    mesaSpan.textContent = customerObj.table; 
    mesaSpan.classList.add('fw-normal');

    const hora = document.createElement('p');
    hora.textContent= 'Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('span');
    horaSpan.textContent = customerObj.hour; 
    horaSpan.classList.add('fw-normal');
    
    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    const heading = document.createElement('h3');
    heading.textContent = 'Platillos Consumidos';
    heading.classList.add('my-4', 'text-center');

    const grupo = document.createElement('ul');
    grupo.classList.add('list-group');

    const {order} = customerObj;
    order.forEach( articulo => {
        const {nombre, cantidad, precio, id} = articulo;

        const lista = document.createElement('li');
        lista.classList.add('list-group-item');

        const nombreEl = document.createElement('h4');
        nombreEl.classList.add('my-4');
        nombreEl.textContent = nombre; 

        //cantidad de productos
        const cantidadEl = document.createElement('p');
        cantidadEl.classList.add('fw-bold');
        cantidadEl.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('span');
        cantidadValor.classList.add('fw-normal')
        cantidadValor.textContent = cantidad;


        // precio del producto
        const precioEl = document.createElement('p');
        precioEl.classList.add('fw-bold');
        precioEl.textContent = 'Precio: ';

        const precioValor = document.createElement('span');
        precioValor.classList.add('fw-normal')
        precioValor.textContent = `$${precio}`;
        
        //subtotal
        const subtotalEl = document.createElement('p');
        subtotalEl.classList.add('fw-bold');
        subtotalEl.textContent = 'Subtotal: ';

        const subtotalValor = document.createElement('span');
        subtotalValor.classList.add('fw-normal')
        subtotalValor.textContent = calculateSubtotal(precio, cantidad);
        
        //botón eliminar 
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar';

        //funcion para el manejo del evento clic para el boton eliminar 
        btnEliminar.onclick = function (){
            deleteProduct(id)
        }

        cantidadEl.appendChild(cantidadValor)
        precioEl.appendChild(precioValor);
        subtotalEl.appendChild(subtotalValor)


        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEl);
        lista.appendChild(subtotalEl);
        lista.appendChild(btnEliminar);

        
        grupo.appendChild(lista);

    } )



    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);

    addTipForm();

}


function calculateSubtotal(precio, cantidad){
    return `$ ${precio*cantidad}`
}

function deleteProduct(id){
    const resultado = customerObj.order.filter( articulo => articulo.id !== id ); 
    customerObj.order = resultado; 

    deleteHTML();

    if(customerObj.order.length !== 0){
        updatePurchaseSummary();
    }else{
        addEmptyOrderMessage();
    }

    const productoEliminado = `#producto-${id}`;
    const inputElimando = document.querySelector(productoEliminado);
    inputElimando.value = 0; 
}

function addEmptyOrderMessage(){
    const contenido = document.querySelector('#resumen .contenido');
    const texto = document.createElement('p');
    texto.classList.add('text-center');
    texto.textContent = 'Añade los elementos del pedido'; 

    contenido.appendChild(texto);
}

function addTipForm(){
    const contenido = document.querySelector('#resumen .contenido');
    const formulario = document.createElement('div');
    formulario.classList.add('col-md-6', 'formulario');


    const divFormulario = document.createElement('div');
    divFormulario.classList.add('card', 'shadow', 'py-2', 'px-3'); 

    const heading = document.createElement('h3')
    heading.classList.add('my-4', 'text-center');
    heading.textContent= 'Propina';


    const radio10 = document.createElement('input');
    radio10.type = 'radio'; 
    radio10.name = 'propina';
    radio10.value= "10";
    radio10.classList.add('form-check-input');
    radio10.onclick = calculateTip; 

    const radioLabel = document.createElement('label');
    radioLabel.textContent = '10%';
    radioLabel.classList.add('form-check-label');

    const radio10div = document.createElement('div');
    radio10div.classList.add('form-check');

    radio10div.appendChild(radio10)
    radio10div.appendChild(radioLabel)

    //radio 25%

    const radio25 = document.createElement('input');
    radio25.type = 'radio'; 
    radio25.name = 'propina';
    radio25.value= "25";
    radio25.classList.add('form-check-input');
    radio25.onclick = calculateTip;

    const radio25Label = document.createElement('label');
    radio25Label.textContent = '25%';
    radio25Label.classList.add('form-check-label');

    const radio25div = document.createElement('div');
    radio25div.classList.add('form-check');

    radio25div.appendChild(radio25)
    radio25div.appendChild(radio25Label)

    //radio 50%

    const radio50 = document.createElement('input');
    radio50.type = 'radio'; 
    radio50.name = 'propina';
    radio50.value= "50";
    radio50.classList.add('form-check-input');
    radio50.onclick = calculateTip; 

    const radio50label = document.createElement('label');
    radio50label.textContent = '50%';
    radio50label.classList.add('form-check-label');

    const radio50div = document.createElement('div');
    radio50div.classList.add('form-check');

    radio50div.appendChild(radio50)
    radio50div.appendChild(radio50label)




    divFormulario.appendChild(heading);
    divFormulario.appendChild(radio10div);
    divFormulario.appendChild(radio25div);
    divFormulario.appendChild(radio50div);
    formulario.appendChild(divFormulario);
    contenido.appendChild(formulario);
}

function calculateTip(){
    const {order} = customerObj; 
    let subtotal = 0; 

    order.forEach(articulo => {
        subtotal += articulo.cantidad * articulo.precio; 
    })

    const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value; 
    
    const propina = ((subtotal * parseInt(propinaSeleccionada) ) / 100)
    
    const total = subtotal + propina; 

    showTotal(subtotal, total, propina); 
}

function showTotal(subtotal, total, propina){

    const divTotales = document.createElement ('DIV');
    divTotales.classList.add( 'total-pagar');

    const subtotalParrafo = document.createElement ('p');
    subtotalParrafo.classList.add('fs-3', 'fw-bold', 'mt-2');
    subtotalParrafo.textContent = 'Subtotal Consumo: ';

    const subtotalSpan = document.createElement ( 'SPAN');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = `$${subtotal}`;

    subtotalParrafo.appendChild(subtotalSpan);

    const propinaParrafo = document.createElement ('p');
    propinaParrafo.classList.add('fs-3', 'fw-bold', 'mt-2');
    propinaParrafo.textContent = 'Propina Consumo: ';

    const propinaSpan = document.createElement ( 'SPAN');
    propinaSpan.classList.add('fw-normal');
    propinaSpan.textContent = `$${propina}`;

    propinaParrafo.appendChild(propinaSpan);

    const totalParrafo = document.createElement ('p');
    totalParrafo.classList.add('fs-3', 'fw-bold', 'mt-2');
    totalParrafo.textContent = 'Total Consumo: ';

    const totalSpan = document.createElement ( 'SPAN');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = `$${total}`;

    totalParrafo.appendChild(totalSpan);

    const totalPagarDiv= document.querySelector('.total-pagar');
    if(totalPagarDiv){
        totalPagarDiv.remove();
    }

    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo);

    const formulario = document.querySelector('.formulario > div');
    formulario.appendChild(divTotales);

}