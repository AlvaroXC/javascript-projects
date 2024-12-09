const container = document.getElementById('container');
const resultado = document.getElementById('resultado');
const formulario = document.getElementById('formulario');

window.addEventListener('load', ()=>{
    formulario.addEventListener('submit', buscarClima);
})


function buscarClima(e){
    e.preventDefault();
    validarFormulario()
}

function validarFormulario(){
    const inputCiudad = document.getElementById('ciudad').value;
    const inputPais = document.getElementById('pais').value;
    
    if(inputCiudad.trim()=== '' || inputPais.trim()===''){
        mostrarError('Todos los campos son obligatorios');
        return;
    }else{
        consultarAPI(inputCiudad, inputPais)
    }

}

function mostrarError(mensaje){
    const existAlert = document.querySelector('.alerta');
    if(!existAlert){
        const alerta = document.createElement('div');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded',
            'max-w-md', 'mx-auto', 'mt-6', 'text-center', 'alerta');
        alerta.innerHTML = `<strong class= "font-bold"> ¡Error! </strong>
            <span class="block">${mensaje}</span>
        `;
        container.appendChild(alerta);

        setTimeout(() => {
            alerta.remove()
        }, 4000);

    }

}

function consultarAPI(ciudad, pais){
    const apiKey = 'a6278e22325994eb2b7f26d4acbba96a';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${apiKey}`
    
    mostrarSpinner();
    
    fetch(url)
        .then(resultado=>{
            return resultado.json();
        })
        .then(datos => {

            limpiarHTML();

            if(datos.cod === '404'){
                mostrarError('Ciudad no encontrada');
            }else{
                mostrarClima(datos)
            }
        })

}

function mostrarClima(datos){
    const {name, main:{temp, temp_max, temp_min}} = datos;
    const centigrados = convertirGradosKelvinACentigrado(temp)
    const centigrados_max = convertirGradosKelvinACentigrado(temp_max)
    const centigrados_min = convertirGradosKelvinACentigrado(temp_min)

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent= name;
    nombreCiudad.classList.add('font-bold', 'text-2xl')

    const temperaturaActual = document.createElement('p');
    temperaturaActual.innerHTML = `${centigrados} &#8451`
    temperaturaActual.classList.add('font-bold', 'text-6xl');
   
    const temperaturaMaxima = document.createElement('p');
    temperaturaMaxima.innerHTML = `Máxima: ${centigrados_max} &#8451`;
    temperaturaMaxima.classList.add('text-xl');
    
    const temperaturaMinima = document.createElement('p');
    temperaturaMinima.innerHTML = `Mínima: ${centigrados_min} &#8451`;
    temperaturaMinima.classList.add('text-xl')

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');

    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(temperaturaActual);
    resultadoDiv.appendChild(temperaturaMaxima);
    resultadoDiv.appendChild(temperaturaMinima);

    resultado.appendChild(resultadoDiv);
}

function convertirGradosKelvinACentigrado(temperaturaKelvin){
    return parseInt(temperaturaKelvin- 273.15)
}


function limpiarHTML(){
    while(resultado.hasChildNodes()){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner(){

    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-fading-circle');
    divSpinner.innerHTML= `
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>
    `;
    resultado.appendChild(divSpinner);
}