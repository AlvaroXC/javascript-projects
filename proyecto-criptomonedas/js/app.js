const criptoSelectElement = document.getElementById('criptomonedas');
const criptFormElement = document.getElementById('formulario');
const currencySelectElement = document.getElementById('moneda');
const resultElement = document.getElementById('resultado');
// const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
//     resolve(criptomonedas);
// })

const searchObj = {
    currency: '',
    cripto: ''
}

document.addEventListener('DOMContentLoaded', ()=> {
    getCriptosFromAPI();
    criptFormElement.addEventListener('submit', validateForm);
    criptoSelectElement.addEventListener('change', addCriptoValueToSearchObj)
    currencySelectElement.addEventListener('change', addCurrencyValueToSearchObj)
})

function getCriptosFromAPI(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
    fetch(url)
    .then(response => response.json())
    .then(data => addOptionsToCriptoSelectElement(data.Data))
    // .then(criptomonedas => mostrarCriptomonedas(criptomonedas))
}   

function addOptionsToCriptoSelectElement(criptomonedas){
    criptomonedas.forEach(cripto => {
        // console.log(cripto)
        const {FullName, Name} = cripto.CoinInfo;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptoSelectElement.appendChild(option);
        
    });
}

function addCriptoValueToSearchObj(e){
    searchObj['cripto'] = e.target.value; 
}

function addCurrencyValueToSearchObj(e){
    searchObj['currency'] = e.target.value;
}

function validateForm(e){
    e.preventDefault();
    if(Object.values(searchObj).some((value) => value ==='')){
        showAlert('Ambos campos son obligatorios');
        return
    }else{
        getCriptoValueFromAPI();
    }
}

function showAlert(message){
    const existAlert = document.querySelector('.error');
    if(!existAlert){
        const divMessage = document.createElement('div');
        divMessage.classList.add('error');
        divMessage.textContent = message;
        criptFormElement.appendChild(divMessage);
    
        setTimeout(() => {
            divMessage.remove();
        }, 3000);
    } 
}

function getCriptoValueFromAPI(){
    const {currency, cripto} = searchObj;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cripto}&tsyms=${currency}`
    
    showSpinner();

    fetch(url)
        .then(response => response.json())
        .then(data => showCriptoData(data.DISPLAY[cripto][currency]));

}

function showCriptoData(data){

    removePreviousHTML()

    const {PRICE, HIGHDAY, LOWDAY, LASTUPDATE, CHANGEPCT24HOUR} = data;
    const newPriceElement = document.createElement('p');
    newPriceElement.classList.add('precio');
    newPriceElement.innerHTML = `El precio es: <span> ${PRICE} </span>`

    const newHighDayElement = document.createElement('p');
    newHighDayElement.innerHTML = `Precio más alto del día: <span> ${HIGHDAY} </span>`;

    const newLowDayElement = document.createElement('p');
    newLowDayElement.innerHTML = `Precio más bajo del día: <span> ${LOWDAY} </span>`;

    const newChangeElement = document.createElement('p');
    newChangeElement.innerHTML = `Variación ultima 24 hrs: <span> ${CHANGEPCT24HOUR}% </span>`;

    const newLastUpdateElement = document.createElement('p');
    newLastUpdateElement.innerHTML = `Ultima acutalización: <span> ${LASTUPDATE} </span>`

    resultElement.appendChild(newPriceElement);
    resultElement.appendChild(newHighDayElement);
    resultElement.appendChild(newLowDayElement);
    resultElement.appendChild(newChangeElement);
    resultElement.appendChild(newLastUpdateElement);
    
}


function removePreviousHTML(){
    while(resultElement.firstChild){
        resultElement.removeChild(resultElement.firstChild);
    }
}

function showSpinner(){
    removePreviousHTML();
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML =  `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `       
    resultElement.appendChild(spinner);
    
}