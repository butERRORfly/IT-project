let formCount = 1;
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


    const dateFormItem = document.createElement('div');
    dateFormItem.classList.add('form-item');
    dateFormItem.classList.add("name");
    const dateLabel = document.createElement('label');
    dateLabel.setAttribute('for', `date_to-${formCount}`);
    dateLabel.textContent = `Дата отбытия ${formCount}:`;
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.id = `date_to-${formCount}`;
    dateInput.name = `date_to-${formCount}`;
    dateFormItem.appendChild(dateLabel);
    dateFormItem.appendChild(dateInput);


    const dateFormItem1 = document.createElement('div');
    dateFormItem1.classList.add('form-item');
    dateFormItem1.classList.add("name");
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
    hotelFormItem.classList.add('form-item');
    hotelFormItem.classList.add("name");
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
    airPortFormItem.classList.add('form-item');
    airPortFormItem.classList.add("name");
    const airPortLabel = document.createElement('label');
    airPortLabel.setAttribute('for', `air-${formCount}`);
    airPortLabel.textContent = `Аэропорт ${formCount}:`;
    const airPortInput = document.createElement('input');
    airPortInput.type = 'text';
    airPortInput.id = `air-${formCount}`;
    airPortInput.name = `air-${formCount}`;
    airPortFormItem.appendChild(airPortLabel);
    airPortFormItem.appendChild(airPortInput);


    const icaoFormItem = document.createElement('div');
    icaoFormItem.classList.add('form-item');
    icaoFormItem.classList.add("name");
    icaoFormItem.classList.add("form");
    const icaoLabel = document.createElement('label');
    icaoLabel.setAttribute('for', `icao-${formCount}`);
    icaoLabel.textContent = `ICAO код ${formCount}:`;
    const icaoInput = document.createElement('input');
    icaoInput.type = 'text';
    icaoInput.id = `icao-${formCount}`;
    icaoInput.name = `icao-${formCount}`;
    icaoFormItem.appendChild(icaoLabel);
    icaoFormItem.appendChild(icaoInput);


    const priceFormItem = document.createElement('div');
    priceFormItem.classList.add('form-item');
    priceFormItem.classList.add("name");
    const priceLabel = document.createElement('label');
    priceLabel.setAttribute('for', `cost-${formCount}`);
    priceLabel.textContent = `Цена посещения за точку ${formCount}:`;
    const priceInput = document.createElement('input');
    priceInput.type = 'number';
    priceInput.id = `cost-${formCount}`;
    priceInput.name = `cost-${formCount}`;
    priceFormItem.appendChild(priceLabel);
    priceFormItem.appendChild(priceInput);
    priceInput.required = true;


    const rate = document.createElement('div');
    rate.classList.add('form-item');
    rate.classList.add("name");
    const rateLabel = document.createElement('label');
    rateLabel.setAttribute('for', `rate-${formCount}`);
    rateLabel.textContent = `Расчетная валюта ${formCount}:`;
    const rateInput = document.createElement('input');
    rateInput.type = 'text';
    rateInput.id = `rate-${formCount}`;
    rateInput.name = `rate-${formCount}`;
    rate.appendChild(rateLabel);
    rate.appendChild(rateInput);
    rateInput.required = true;

    newFormContainer.appendChild(pointFormItem);
    newFormContainer.appendChild(dateFormItem);
    newFormContainer.appendChild(dateFormItem1);
    newFormContainer.appendChild(hotelFormItem);
    newFormContainer.appendChild(airPortFormItem);
    newFormContainer.appendChild(icaoFormItem);
    newFormContainer.appendChild(priceFormItem);
    newFormContainer.appendChild(rate);


    document.getElementById('form-wrapper').insertBefore(newFormContainer, document.querySelector('.add-button'));
}



async function submitData() {
    try {
        const formsData = [];

        for (let i = 1; i <= formCount; i++) {
            const point = document.getElementById(`point-${i}`).value;
            const date_to = document.getElementById(`date_to-${i}`).value;
            const date_out = document.getElementById(`date_out-${i}`).value;
            const gost = document.getElementById(`gost-${i}`).value;
            const air = document.getElementById(`air-${i}`).value;
            const icao = document.getElementById(`icao-${i}`).value;
            let cost = document.getElementById(`cost-${i}`).value;
            const rate = document.getElementById(`rate-${i}`).value;
            cost = (cost+'-'+rate).toUpperCase();
            if (rate.toUpperCase() == "USD"){
                const convertedRate = cost;
                formsData.push({ point, date_to, date_out, gost, air, icao, convertedRate, cost });
            }
            else{
                const convertedRate = await convert(rate.toUpperCase(), 'USD', parseInt(cost));
                console.log(convertedRate);
                formsData.push({ point, date_to, date_out, gost, air, icao, convertedRate, cost });
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