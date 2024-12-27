const resultado = document.getElementById('resultado');
const formulario = document.getElementById('formulario');
const paginacion = document.getElementById('paginacion')

const registrosPorPagina = 40;
let totalPaginas; 
let iterador;
let paginaActual = 1; 

document.addEventListener('DOMContentLoaded', ()=>{
    formulario.addEventListener('submit', validarFormulario);
});

function validarFormulario(e){
    e.preventDefault();
    const terminoBusqueda = document.getElementById('termino').value;

    if(terminoBusqueda===''){
        mostrarAlerta('Agrega un termino de busqueda');
        return;
    }else{
        buscarImagenes();
    }
}

function mostrarAlerta(mensaje){

    const existeAlerta = document.querySelector('.bg-red-100');

    if(!existeAlerta){

        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
    
        const errorStrong = document.createElement('strong');
        errorStrong.classList.add('font-bold');
        errorStrong.textContent = 'Error!';
    
        const spanMensaje = document.createElement('span');
        spanMensaje.classList.add('block');
        spanMensaje.textContent = mensaje;
    
        alerta.appendChild(errorStrong);
        alerta.appendChild(spanMensaje);
    
    
        formulario.appendChild(alerta);
        setTimeout(() => {
            alerta.remove()
        }, 3000);
    }


}

async function buscarImagenes(){


    const termino = document.getElementById('termino').value;
    const key = '47029565-a47a69dc3b801225ef8d0cc52';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        totalPaginas = calcularPaginas(data.totalHits)
        mostrarImagenes(data.hits)
    } catch (error) {
        console.error(error);
    }
}   

function mostrarImagenes(imagenesJSON){

    limpiarHTML();

    imagenesJSON.forEach(imagen => {
        const {previewURL, largeImageURL, views, likes} = imagen;
        resultado.innerHTML += `
            <div class="W-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}">

                    <div class="p-4">
                        <p class="font-bold"> ${likes} <span class="font-light"> Me gusta</span> </p>
                        <p class="font-bold"> ${views} <span class="font-light"> Veces vista</span> </p>
                        <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">Ver imagen</a>
                    </div>

                </div>
            </div>
        `
    });

    //limpiar el paginador previo
    while(paginacion.firstChild){
        paginacion.removeChild(paginacion.firstChild);
    }
    //generar el nuevo html de paginador
    imprimirPaginador();
}

function calcularPaginas(total){
    return parseInt(Math.ceil(total/registrosPorPagina));
}

function *crearPaginador(totalPaginas){
    for (let i = 1; i<=totalPaginas; i++) {
        yield i;
    }
}

function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas);
    while(true){
        const {value, done} = iterador.next();
        if(done) return

        const btn = document.createElement('a');
        btn.href = '#';
        btn.dataset = value; 
        btn.textContent= value; 
        btn.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'uppercase', 'rounded')
        btn.onclick = () => {
            paginaActual = value; 
            buscarImagenes();
        }
        paginacion.appendChild(btn)
    }
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}
