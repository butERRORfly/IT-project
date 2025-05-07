let formCount = 0;
let node = 0;
async function convert(from, to, amount) {
  try {
    const response = await fetch(`https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`);
    const data = await response.json();
    const convertedAmount = (amount * data.rates[to]).toFixed(2);
    return convertedAmount;
  } catch (error) {
    console.error('Ошибка при конвертации:', error);
    return null;
  }
}

function addForm() {
    formCount++;
    const newFormContainer = document.createElement('div');
    newFormContainer.classList.add('form-container');
    newFormContainer.id = `form-container-${formCount}`;
    const pointFormItem = document.createElement('div');
    pointFormItem.classList.add('form-item');
    pointFormItem.classList.add('form');
    pointFormItem.classList.add("name");
    const pointLabel = document.createElement('label');
    pointLabel.setAttribute('for', `point-${formCount}`);
    pointLabel.textContent = `Название точки ${formCount}:`;
    const pointInput = document.createElement('input');
    pointInput.classList.add('form');
    pointInput.type = 'text';
    pointInput.id = `point-${formCount}`;
    pointInput.name = `point-${formCount}`;
    pointFormItem.appendChild(pointLabel);
    pointFormItem.appendChild(pointInput);

    const block = document.createElement('div');
    block.classList.add("form");
    block.classList.add('form-item');
    block.classList.add("name");
    const wayLabel = document.createElement('label');
    wayLabel.textContent = 'Транспорт отправления';
    const typeWay = document.createElement('select');
    typeWay.classList.add('selector');
    wayLabel.classList.add('name');
    typeWay.id = `type_way-${formCount}`;
    const option1 = document.createElement('option');
    option1.value = 'car';
    option1.textContent = 'car';
    const option2 = document.createElement('option');
    option2.value = 'poliline';
    option2.textContent = 'poliline';
    typeWay.appendChild(option1);
    typeWay.appendChild(option2);
    typeWay.value = 'poliline';
    block.appendChild(wayLabel);
    block.appendChild(typeWay);


    const dateFormItem = document.createElement('div');
    dateFormItem.classList.add('form-item');
    dateFormItem.classList.add('form');
    dateFormItem.classList.add("name");
    const dateLabel = document.createElement('label');
    dateLabel.setAttribute('for', `date_to-${formCount}`);
    dateLabel.textContent = `Дата прибытия ${formCount}:`;
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.id = `date_to-${formCount}`;
    dateInput.name = `date_to-${formCount}`;
    dateFormItem.appendChild(dateLabel);
    dateFormItem.appendChild(dateInput);

    const dateFormItem1 = document.createElement('div');
    dateFormItem1.classList.add('form-item');
    dateFormItem1.classList.add("name");
    dateFormItem1.classList.add('form');
    const dateOutLabel = document.createElement('label');
    dateOutLabel.setAttribute('for', `date_out-${formCount}`);
    dateOutLabel.textContent = `Дата отбытия ${formCount}:`;
    const dateOutInput = document.createElement('input');
    dateOutInput.type = 'date';
    dateOutInput.id = `date_out-${formCount}`;
    dateOutInput.name = `date_out-${formCount}`;
    dateFormItem1.appendChild(dateOutLabel);
    dateFormItem1.appendChild(dateOutInput);

    const hotelFormItem = document.createElement('div');
    hotelFormItem.id = `hostel-${formCount}`;
    hotelFormItem.classList.add('form-item');
    hotelFormItem.classList.add("name");
    hotelFormItem.classList.add('form');
    const hotelLabel = document.createElement('label');
    hotelLabel.setAttribute('for', `gost-${formCount}`);
    hotelLabel.textContent = `Гостиница ${formCount}:`;
    const hotelInput = document.createElement('input');
    hotelInput.type = 'text';
    hotelInput.id = `gost-${formCount}`;
    hotelInput.name = `gost-${formCount}`;
    hotelFormItem.appendChild(hotelLabel);
    hotelFormItem.appendChild(hotelInput);

    const airPortFormItem = document.createElement('div');
    airPortFormItem.id = `fly-${formCount}`;
    airPortFormItem.classList.add('form-item');
    airPortFormItem.classList.add('form');
    airPortFormItem.classList.add("name");
    const airPortLabel = document.createElement('label');
    airPortLabel.setAttribute('for', `air-${formCount}`);
    airPortLabel.textContent = `Аэропорт прилета:`;
    const airPortInput = document.createElement('input');
    airPortInput.type = 'text';
    airPortInput.id = `air-${formCount}`;
    airPortInput.name = `air-${formCount}`;
    airPortFormItem.appendChild(airPortLabel);
    airPortFormItem.appendChild(airPortInput);

    const icaoFormItem = document.createElement('div');
    icaoFormItem.id = `table-${formCount}`;
    icaoFormItem.classList.add('form-item');
    icaoFormItem.classList.add("name");
    icaoFormItem.classList.add("form");
    const icaoLabel = document.createElement('label');
    icaoLabel.setAttribute('for', `icao-${formCount}`);
    icaoLabel.textContent = `ICAO код `;
    const icaoInput = document.createElement('input');
    icaoInput.type = 'text';
    icaoInput.id = `icao-${formCount}`;
    icaoInput.name = `icao-${formCount}`;
    icaoFormItem.appendChild(icaoLabel);
    icaoFormItem.appendChild(icaoInput);
    const airPortFormItem2 = document.createElement('div');
    airPortFormItem2.id = `fly1-${formCount}`;
    airPortFormItem2.classList.add('form-item');
    airPortFormItem2.classList.add('form');
    airPortFormItem2.classList.add("name");
    const airPortLabel2 = document.createElement('label');
    airPortLabel2.setAttribute('for', `air2-${formCount}`);
    airPortLabel2.textContent = `Аэропорт вылета:`;
    const airPortInput2 = document.createElement('input');
    airPortInput2.type = 'text';
    airPortInput2.id = `air2-${formCount}`;
    airPortInput2.name = `air2-${formCount}`;
    airPortFormItem2.appendChild(airPortLabel2);
    airPortFormItem2.appendChild(airPortInput2);



    const icaoFormItem2 = document.createElement('div');
    icaoFormItem2.id = `table1-${formCount}`;
    icaoFormItem2.classList.add('form-item');
    icaoFormItem2.classList.add("name");
    icaoFormItem2.classList.add("form");
    const icaoLabel2 = document.createElement('label');
    icaoLabel2.setAttribute('for', `icao2-${formCount}`);
    icaoLabel2.textContent = `ICAO`;
    const icaoInput2 = document.createElement('input');
    icaoInput2.type = 'text';
    icaoInput2.id = `icao2-${formCount}`;
    icaoInput2.name = `icao2-${formCount}`;
    icaoFormItem2.appendChild(icaoLabel2);
    icaoFormItem2.appendChild(icaoInput2);



    const priceFormItem = document.createElement('div');
    priceFormItem.classList.add('form-item');
    priceFormItem.classList.add('form');
    priceFormItem.classList.add("name");
    const priceLabel = document.createElement('label');
    priceLabel.setAttribute('for', `cost-${formCount}`);
    priceLabel.textContent = `Цена посещения за точку `;
    const priceInput = document.createElement('input');
    priceInput.type = 'number';
    priceInput.id = `cost-${formCount}`;
    priceInput.name = `cost-${formCount}`;
    priceFormItem.appendChild(priceLabel);
    priceFormItem.appendChild(priceInput);
    priceInput.required = true;

    const rate = document.createElement('div');
    rate.classList.add('form-item');
    rate.classList.add('form');
    rate.classList.add("name");
    const rateLabel = document.createElement('label');
    rateLabel.setAttribute('for', `rate-${formCount}`);
    rateLabel.textContent = `Расчетная валюта `;
    const VAL = document.createElement('select');
    VAL.classList.add('selector');
    VAL.id = `rate-${formCount}`;
    VAL.name = `rate-${formCount}`;
    rate.appendChild(rateLabel);
    rate.appendChild(VAL);

    const delete_block = document.createElement('button');
    delete_block.classList.add('form-item');
    delete_block.classList.add('delete-btn');
    delete_block.id = `deleter-${formCount}`;
    delete_block.textContent = `Удалить точку`;
    delete_block.addEventListener('click', (event) => {
            delete_point(event, formCount);
    });



    newFormContainer.appendChild(pointFormItem);
    newFormContainer.appendChild(block);
    newFormContainer.appendChild(dateFormItem);
    newFormContainer.appendChild(dateFormItem1);
    newFormContainer.appendChild(hotelFormItem);
    if (node===0){
    newFormContainer.appendChild(airPortFormItem);
    newFormContainer.appendChild(icaoFormItem);
    }
    node = 0;
    newFormContainer.appendChild(airPortFormItem2);
    newFormContainer.appendChild(icaoFormItem2);
    newFormContainer.appendChild(priceFormItem);
    newFormContainer.appendChild(rate);
    newFormContainer.appendChild(delete_block);

    document.getElementById('form-wrapper').insertBefore(newFormContainer, document.querySelector('.add-button'));
    add_cur();

    setTimeout(() => {
        initAllAutocompletes();
    }, 0);
}

async function submitData() {
    try {
        const formsData = [];
        for (let i = 0; i <= formCount; i++) {
            const point = document.getElementById(`point-${i}`).value;
            const dateElement = document.getElementById(`date_to-${i}`);
            const date_to = dateElement ? dateElement.value : '!';

            const date_out = document.getElementById(`date_out-${i}`).value;
            const gost = document.getElementById(`gost-${i}`).value;

            const icaoElement = document.getElementById(`icao-${i}`);
            const icao = icaoElement ? icaoElement.value : '!';

            const airElement = document.getElementById(`air-${i}`);
            const air = airElement ? airElement.value : '!';

            const icao2Element = document.getElementById(`icao2-${i}`);
            const icao2 = icao2Element ? icao2Element.value : '!';

            const air2Element = document.getElementById(`air2-${i}`);
            const air2 = air2Element ? air2Element.value : '!';

            const typic = document.getElementById(`type_way-${i}`).value;
            let cost = document.getElementById(`cost-${i}`).value;
            const rate = document.getElementById(`rate-${i}`).value;
            const cost_for_usd = cost;
            cost = (cost+'-'+rate).toUpperCase();
            console.log(rate);
            if (rate.toUpperCase() == 'USD'){
                const convertedRate = cost_for_usd;
                formsData.push({ point, date_to, date_out, gost, air, icao, air2, icao2, convertedRate, cost, typic});
            }
            else{
                const convertedRate = await convert(rate.toUpperCase(), 'USD', parseInt(cost));
                console.log(convertedRate);
                formsData.push({ point, date_to, date_out, gost, air, icao, air2, icao2, convertedRate, cost, typic });
            }
        }

        console.log("Отправляемые данные:", formsData);
        const response = await fetch('http://127.0.0.1:8000/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formsData)
        });

        if (!response.ok) {
            console.error(`Ошибка при отправке данных: ${response.status}`);
            alert("Произошла ошибка при отправке данных.");
            return;
        }

        const result = await response.text();
        document.open();
        document.write(result);
        document.close();

    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка сети или сервера.');
    }
}
function delete_point(event,id){
    let point_to_delete = document.getElementById(`form-container-${id}`);
    point_to_delete.remove();
    formCount = formCount-1;
}

function add_cur(){
    const currencies = [
  { "code": "AUD", "name": "Australian Dollar" },
  { "code": "BGN", "name": "Bulgarian Lev" },
  { "code": "BRL", "name": "Brazilian Real" },
  { "code": "CAD", "name": "Canadian Dollar" },
  { "code": "CHF", "name": "Swiss Franc" },
  { "code": "CNY", "name": "Chinese Yuan" },
  { "code": "CZK", "name": "Czech Koruna" },
  { "code": "DKK", "name": "Danish Krone" },
  { "code": "EUR", "name": "Euro" },
  { "code": "GBP", "name": "British Pound Sterling" },
  { "code": "HKD", "name": "Hong Kong Dollar" },
  { "code": "HUF", "name": "Hungarian Forint" },
  { "code": "IDR", "name": "Indonesian Rupiah" },
  { "code": "ILS", "name": "Israeli New Shekel" },
  { "code": "INR", "name": "Indian Rupee" },
  { "code": "ISK", "name": "Icelandic Krona" },
  { "code": "JPY", "name": "Japanese Yen" },
  { "code": "KRW", "name": "South Korean Won" },
  { "code": "MXN", "name": "Mexican Peso" },
  { "code": "MYR", "name": "Malaysian Ringgit" },
  { "code": "NOK", "name": "Norwegian Krone" },
  { "code": "NZD", "name": "New Zealand Dollar" },
  { "code": "PHP", "name": "Philippine Peso" },
  { "code": "PLN", "name": "Polish Zloty" },
  { "code": "RON", "name": "Romanian Leu" },
  { "code": "SEK", "name": "Swedish Krona" },
  { "code": "SGD", "name": "Singapore Dollar" },
  { "code": "THB", "name": "Thai Baht" },
  { "code": "TRY", "name": "Turkish Lira" },
  { "code": "USD", "name": "United States Dollar" },
  { "code": "ZAR", "name": "South African Rand" }
  ];
  const select = document.getElementById(`rate-${formCount}`);
  for (let i = 0; i < currencies.length; i++) {
    const option = document.createElement('option');
    option.value = currencies[i].code;
    option.textContent = currencies[i].name;
    select.appendChild(option);
  }
  select.value = "USD";
}

function valid(value) {
    return /^[1-9]\d*$/.test(value);
}
document.addEventListener('input', function(event) {
    const target = event.target;
    if (target.tagName === 'INPUT' && /^cost-\d+$/.test(target.id)) {
      if (!valid(target.value)) {
        target.value = '';
      }
    }
});

function destroy(selectId){
    node = 1;
    if (parseInt(selectId,10) === 0){
        console.log(`fly1-${selectId}`);
        document.getElementById(`fly1-${selectId}`).remove();
        document.getElementById(`table1-${selectId}`).remove();
        if (formCount >= parseInt(selectId,10)){
            document.getElementById(`fly-${parseInt(selectId,10)+1}`).remove();
            document.getElementById(`table-${parseInt(selectId,10)+1}`).remove();
        }
    }
    if (parseInt(selectId,10) > 0){
        document.getElementById(`fly1-${selectId}`).remove();
        document.getElementById(`table1-${selectId}`).remove();
        if (formCount > parseInt(selectId,10)){
            document.getElementById(`fly-${parseInt(selectId,10)+1}`).remove();
            document.getElementById(`table-${parseInt(selectId,10)+1}`).remove();
        }
    }
}
function append(selectId){
    node = 0;
    if (parseInt(selectId,10) > -1){
        let airPortFormItem2 = document.createElement('div');
        airPortFormItem2.id = `fly1-${parseInt(selectId,10)}`;
        airPortFormItem2.classList.add('form-item');
        airPortFormItem2.classList.add('form');
        airPortFormItem2.classList.add("name");
        const airPortLabel2 = document.createElement('label');
        airPortLabel2.setAttribute('for', `air-${parseInt(selectId,10)}`);
        airPortLabel2.textContent = `Аэропорт вылета:`;
        let airPortInput2 = document.createElement('input');
        airPortInput2.type = 'text';
        airPortInput2.id = `air2-${parseInt(selectId,10)}`;
        airPortInput2.name = `air2-${parseInt(selectId,10)}`;
        airPortFormItem2.appendChild(airPortLabel2);
        airPortFormItem2.appendChild(airPortInput2);

        let icaoFormItem2 = document.createElement('div');
        icaoFormItem2.id = `table1-${parseInt(selectId,10)}`;
        icaoFormItem2.classList.add('form-item');
        icaoFormItem2.classList.add("name");
        icaoFormItem2.classList.add("form");
        const icaoLabel2 = document.createElement('label');
        icaoLabel2.setAttribute('for', `icao-${parseInt(selectId,10)}`);
        icaoLabel2.textContent = `ICAO `;
        const icaoInput2 = document.createElement('input');
        icaoInput2.type = 'text';
        icaoInput2.id = `icao2-${parseInt(selectId,10)}`;
        icaoInput2.name = `icao2-${parseInt(selectId,10)}`;
        icaoFormItem2.appendChild(icaoLabel2);
        icaoFormItem2.appendChild(icaoInput2);
        let h = document.getElementById(`hostel-${parseInt(selectId,10)}`);
        h.parentNode.insertBefore(airPortFormItem2,h.nextSibling);
        airPortFormItem2.parentNode.insertBefore(icaoFormItem2,airPortFormItem2.nextSibling);

        if (formCount >parseInt(selectId,10)){
        let load = parseInt(selectId,10) +1;
        const airPortFormItem = document.createElement('div');
        airPortFormItem.id = `fly-${load}`;
        airPortFormItem.classList.add('form-item');
        airPortFormItem.classList.add('form');
        airPortFormItem.classList.add("name");
        const airPortLabel = document.createElement('label');
        airPortLabel.setAttribute('for', `air-${load}`);
        airPortLabel.textContent = `Аэропорт прилета:`;
        const airPortInput = document.createElement('input');
        airPortInput.type = 'text';
        airPortInput.id = `air-${load}`;
        airPortInput.name = `air-${load}`;
        airPortFormItem.appendChild(airPortLabel);
        airPortFormItem.appendChild(airPortInput);

        const icaoFormItem = document.createElement('div');
        icaoFormItem.id = `table-${load}`;
        icaoFormItem.classList.add('form-item');
        icaoFormItem.classList.add("name");
        icaoFormItem.classList.add("form");
        const icaoLabel = document.createElement('label');
        icaoLabel.setAttribute('for', `icao-${load}`);
        icaoLabel.textContent = `ICAO код `;
        const icaoInput = document.createElement('input');
        icaoInput.type = 'text';
        icaoInput.id = `icao-${load}`;
        icaoInput.name = `icao-${load}`;
        icaoFormItem.appendChild(icaoLabel);
        icaoFormItem.appendChild(icaoInput);

        const h1 = document.getElementById(`hostel-${parseInt(load,10)}`);

        h1.parentNode.insertBefore(airPortFormItem,h1.nextSibling);
        airPortFormItem.parentNode.insertBefore(icaoFormItem,airPortFormItem.nextSibling);
        }
    }
}

document.addEventListener('change', function(event) {
    const target = event.target;
    if (target.tagName === 'SELECT' && target.id.startsWith('type_way-')) {
      const val = target.value;
      const selectId = target.id.split('-')[1];
      if (val === 'car'){
        destroy(selectId);
      }
      else if (val === 'poliline'){
        append(selectId);
      }

    }
});

add_cur()
