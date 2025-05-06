let formCount = 0;
// let node = 0; // Removed global 'node' variable

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

function setupAutocomplete() {
    const airportInputs = document.querySelectorAll('.name-autocomplete');

    airportInputs.forEach(input => {
        // Remove old event listeners to prevent duplicates if setupAutocomplete is called multiple times
        // A more robust way would be to use a marker or check if listener already exists,
        // but for simplicity, let's assume this is sufficient or handle it via a wrapper if issues arise.
        // Or, only call setupAutocomplete on newly added elements.
        // For now, let's ensure we add listeners only once or manage them carefully.
        // A simple flag can work:
        if (input.dataset.autocompleteAttached) return;
        input.dataset.autocompleteAttached = 'true';

        const resultsId = input.id + '-results'; // Adjusted resultsId generation
        const resultsDiv = document.getElementById(resultsId);

        if (!resultsDiv) {
            console.error(`Results div not found for input ${input.id}: ${resultsId}`);
            return;
        }

        input.addEventListener('input', async function(e) {
            const query = e.target.value.trim();

            if (query.length < 2) {
                resultsDiv.innerHTML = '';
                resultsDiv.style.display = 'none';
                return;
            }

            try {
                const response = await fetch(`/airports/search?query=${encodeURIComponent(query)}`);
                const airports = await response.json();

                resultsDiv.innerHTML = '';

                if (airports.length === 0) {
                    resultsDiv.style.display = 'none';
                    return;
                }

                airports.forEach(airport => {
                    const div = document.createElement('div');
                    div.innerHTML = `<strong>${airport.name}</strong> (${airport.icao})`;
                    div.addEventListener('click', () => {
                        input.value = `${airport.name} (${airport.icao})`;
                        resultsDiv.style.display = 'none';
                    });
                    resultsDiv.appendChild(div);
                });

                resultsDiv.style.display = 'block';
            } catch (error) {
                console.error('Error fetching airports:', error);
                resultsDiv.style.display = 'none';
            }
        });

        document.addEventListener('click', function(e) {
            if (e.target !== input && !resultsDiv.contains(e.target)) { // Ensure clicking on results doesn't hide it
                resultsDiv.style.display = 'none';
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', setupAutocomplete);


function addForm() {
    formCount++;
    const newFormContainer = document.createElement('div');
    newFormContainer.classList.add('form-container');
    newFormContainer.id = `form-container-${formCount}`;

    const pointFormItem = document.createElement('div');
    pointFormItem.classList.add('form-item', 'form', 'name');
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
    block.classList.add("form", 'form-item', "name");
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
    typeWay.value = 'poliline'; // Default to poliline
    block.appendChild(wayLabel);
    block.appendChild(typeWay);

    const dateFormItem = document.createElement('div');
    dateFormItem.classList.add('form-item', 'form', 'name');
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
    dateFormItem1.classList.add('form-item', 'name', 'form');
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
    hotelFormItem.classList.add('form-item', 'name', 'form');
    const hotelLabel = document.createElement('label');
    hotelLabel.setAttribute('for', `gost-${formCount}`);
    hotelLabel.textContent = `Гостиница ${formCount}:`;
    const hotelInput = document.createElement('input');
    hotelInput.type = 'text';
    hotelInput.id = `gost-${formCount}`;
    hotelInput.name = `gost-${formCount}`;
    hotelFormItem.appendChild(hotelLabel);
    hotelFormItem.appendChild(hotelInput);

    // Arrival Airport (single autocomplete field) - only for formCount > 0
    let arrivalAirportItem;
    if (formCount > 0) {
        arrivalAirportItem = document.createElement('div');
        arrivalAirportItem.id = `arrival-airport-item-${formCount}`;
        arrivalAirportItem.classList.add('form-item', 'form', 'name');

        const arrivalAirportLabel = document.createElement('label');
        arrivalAirportLabel.setAttribute('for', `airport-arrival-${formCount}`);
        arrivalAirportLabel.textContent = `Аэропорт прилета (название или ICAO):`;
        const arrivalAirportInput = document.createElement('input');
        arrivalAirportInput.type = 'text';
        arrivalAirportInput.id = `airport-arrival-${formCount}`;
        arrivalAirportInput.name = `airport-arrival-${formCount}`;
        arrivalAirportInput.classList.add('form', 'name-autocomplete');
        arrivalAirportInput.placeholder = "Название или ICAO";
        arrivalAirportInput.autocomplete = 'off';
        const arrivalAirportResultsDiv = document.createElement('div');
        arrivalAirportResultsDiv.classList.add('autocomplete-results');
        arrivalAirportResultsDiv.id = `airport-arrival-${formCount}-results`;

        arrivalAirportItem.appendChild(arrivalAirportLabel);
        arrivalAirportItem.appendChild(arrivalAirportInput);
        arrivalAirportItem.appendChild(arrivalAirportResultsDiv);

        // Set initial visibility based on previous form's transport type
        const prevFormIndex = formCount - 1;
        const prevTypeWayElement = document.getElementById(`type_way-${prevFormIndex}`);
        if (prevTypeWayElement && prevTypeWayElement.value === 'car') {
            arrivalAirportItem.style.display = 'none';
        } else {
            arrivalAirportItem.style.display = 'block'; // Or 'flex', or remove to use CSS default
        }
    }

    // Departure Airport (single autocomplete field)
    const departureAirportItem = document.createElement('div');
    departureAirportItem.id = `departure-airport-item-${formCount}`;
    departureAirportItem.classList.add('form-item', 'form', 'name');
    departureAirportItem.style.display = 'block'; // Default visible if poliline is default for this form

    const departureAirportLabel = document.createElement('label');
    departureAirportLabel.setAttribute('for', `airport-departure-${formCount}`);
    departureAirportLabel.textContent = `Аэропорт вылета (название или ICAO):`;
    const departureAirportInput = document.createElement('input');
    departureAirportInput.type = 'text';
    departureAirportInput.id = `airport-departure-${formCount}`;
    departureAirportInput.name = `airport-departure-${formCount}`;
    departureAirportInput.classList.add('form', 'name-autocomplete');
    departureAirportInput.placeholder = "Название или ICAO";
    departureAirportInput.autocomplete = 'off';
    const departureAirportResultsDiv = document.createElement('div');
    departureAirportResultsDiv.classList.add('autocomplete-results');
    departureAirportResultsDiv.id = `airport-departure-${formCount}-results`;

    departureAirportItem.appendChild(departureAirportLabel);
    departureAirportItem.appendChild(departureAirportInput);
    departureAirportItem.appendChild(departureAirportResultsDiv);


    const priceFormItem = document.createElement('div');
    priceFormItem.classList.add('form-item', 'form', 'name');
    const priceLabel = document.createElement('label');
    priceLabel.setAttribute('for', `cost-${formCount}`);
    priceLabel.textContent = `Цена посещения за точку `;
    const priceInput = document.createElement('input');
    priceInput.type = 'number';
    priceInput.id = `cost-${formCount}`;
    priceInput.name = `cost-${formCount}`;
    priceInput.required = true;
    priceFormItem.appendChild(priceLabel);
    priceFormItem.appendChild(priceInput);

    const rate = document.createElement('div');
    rate.classList.add('form-item', 'form', 'name');
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
    delete_block.classList.add('form-item', 'delete-btn');
    delete_block.id = `deleter-${formCount}`;
    delete_block.textContent = `Удалить точку`;
    delete_block.addEventListener('click', (event) => {
        delete_point(event, formCount); // Pass the correct ID for deletion
    });

    newFormContainer.appendChild(pointFormItem);
    newFormContainer.appendChild(block); // type_way
    newFormContainer.appendChild(dateFormItem); // date_to
    newFormContainer.appendChild(dateFormItem1); // date_out
    newFormContainer.appendChild(hotelFormItem);
    if (arrivalAirportItem) {
        newFormContainer.appendChild(arrivalAirportItem);
    }
    newFormContainer.appendChild(departureAirportItem);
    newFormContainer.appendChild(priceFormItem);
    newFormContainer.appendChild(rate);
    newFormContainer.appendChild(delete_block);

    document.getElementById('form-wrapper').insertBefore(newFormContainer, document.querySelector('.add-button'));
    add_cur(); // Populates currency dropdown
    setupAutocomplete(); // Setup autocomplete for the new form's inputs
}

function parseAirportString(airportString) {
    if (!airportString || airportString.trim() === '' || airportString === '!') {
        return { name: '!', icao: '!' };
    }
    const match = airportString.match(/(.*) \(([^)]+)\)$/);
    if (match && match.length === 3) {
        return { name: match[1].trim(), icao: match[2].trim().toUpperCase() };
    }
    // Fallback: if it looks like an ICAO code (3-4 uppercase letters/digits)
    if (airportString.length >= 3 && airportString.length <= 4 && airportString === airportString.toUpperCase() && /^[A-Z0-9]+$/.test(airportString)) {
        return { name: '!', icao: airportString.trim() };
    }
    // Default to name if not parsable otherwise
    return { name: airportString.trim(), icao: '!' };
}

async function submitData() {
    try {
        const formsData = [];
        // Iterate over existing form containers to handle deletions correctly
        const formContainers = document.querySelectorAll('.form-container[id^="form-container-"]');

        for (const formContainer of formContainers) {
            const idMatch = formContainer.id.match(/form-container-(\d+)/);
            if (!idMatch) continue;
            const i = idMatch[1]; // Get the index from the container's ID

            const pointElement = document.getElementById(`point-${i}`);
            if (!pointElement) continue; // Skip if essential elements are missing (form might be malformed/deleted)
            const point = pointElement.value;

            const dateElement = document.getElementById(`date_to-${i}`);
            const date_to = dateElement ? dateElement.value : '!';

            const dateOutElement = document.getElementById(`date_out-${i}`);
            const date_out = dateOutElement ? dateOutElement.value : '!';

            const gostElement = document.getElementById(`gost-${i}`);
            const gost = gostElement ? gostElement.value : '!';

            let air = '!', icao = '!', air2 = '!', icao2 = '!';

            // Arrival Airport (relevant for i > 0 conceptually, but check element existence and visibility)
            const arrivalAirportInputElement = document.getElementById(`airport-arrival-${i}`);
            const arrivalAirportItemElement = document.getElementById(`arrival-airport-item-${i}`);
            if (arrivalAirportInputElement && arrivalAirportItemElement && arrivalAirportItemElement.style.display !== 'none') {
                const parsed = parseAirportString(arrivalAirportInputElement.value);
                air = parsed.name;
                icao = parsed.icao;
            }

            // Departure Airport
            const departureAirportInputElement = document.getElementById(`airport-departure-${i}`);
            const departureAirportItemElement = document.getElementById(`departure-airport-item-${i}`);
            if (departureAirportInputElement && departureAirportItemElement && departureAirportItemElement.style.display !== 'none') {
                const parsed = parseAirportString(departureAirportInputElement.value);
                air2 = parsed.name;
                icao2 = parsed.icao;
            }

            const typicElement = document.getElementById(`type_way-${i}`);
            const typic = typicElement ? typicElement.value : 'poliline';

            const costElement = document.getElementById(`cost-${i}`);
            let cost = costElement ? costElement.value : '0';

            const rateElement = document.getElementById(`rate-${i}`);
            const rate = rateElement ? rateElement.value : 'USD';

            const cost_for_usd = parseFloat(cost) || 0; // Ensure cost is a number for conversion
            let cost_string = `${cost_for_usd}-${rate.toUpperCase()}`; // Keep original cost string format

            let convertedRateVal;
            if (rate.toUpperCase() === 'USD') {
                convertedRateVal = cost_for_usd.toFixed(2);
            } else {
                convertedRateVal = await convert(rate.toUpperCase(), 'USD', cost_for_usd);
                if (convertedRateVal === null) convertedRateVal = 'Error'; // Handle conversion error
            }
            formsData.push({ point, date_to, date_out, gost, air, icao, air2, icao2, convertedRate: convertedRateVal, cost: cost_string, typic });
        }


        console.log("Отправляемые данные:", formsData);
        if (formsData.length === 0 && formCount >=0) { // Check if initial form had issues or no forms submitted
             const initialFormExists = document.getElementById('form-container-0');
             if (!initialFormExists || !document.getElementById('point-0')) {
                 alert("Нет данных для отправки. Пожалуйста, заполните хотя бы одну точку.");
                 return;
             }
        }


        const response = await fetch('http://127.0.0.1:8000/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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

function delete_point(event, id_to_delete) {
    // id_to_delete is the index part of the id, e.g., 1 from form-container-1
    let point_to_delete = document.getElementById(`form-container-${id_to_delete}`);
    if (point_to_delete) {
        point_to_delete.remove();
        // Note: formCount is not strictly decremented here as it represents the max index ever reached.
        // The submitData iterates through existing forms, so gaps are handled.
        // If you need to strictly manage formCount as "current number of forms", more logic is needed
        // for re-indexing or managing a list of active form IDs.
        // For now, this just removes the element.

        // After deleting point `k`, we might need to update visibility of airport fields
        // for point `k-1` (its departure) and point `k+1` (its arrival).
        // This can get complex. For simplicity, let's assume the user will manually adjust
        // transport types if needed, or this behavior is acceptable.
        // A full re-evaluation of linked airport visibilities would be:
        const prevFormIndex = parseInt(id_to_delete, 10) - 1;
        const nextFormIndex = parseInt(id_to_delete, 10) + 1; // This was the old k+1

        // If form k-1 exists, its type_way now dictates arrival to what was form k+1 (now effectively form k)
        const prevTypeWayElement = document.getElementById(`type_way-${prevFormIndex}`);
        const nextArrivalAirportItem = document.getElementById(`arrival-airport-item-${nextFormIndex}`); // This ID might now belong to a re-indexed form or a new form with this index

        if (prevTypeWayElement && nextArrivalAirportItem) {
            if (prevTypeWayElement.value === 'car') {
                nextArrivalAirportItem.style.display = 'none';
            } else {
                nextArrivalAirportItem.style.display = 'block';
            }
        }
    }
}


function add_cur(){
    const currencies = [
      { "code": "AUD", "name": "Australian Dollar" }, { "code": "BGN", "name": "Bulgarian Lev" },
      { "code": "BRL", "name": "Brazilian Real" }, { "code": "CAD", "name": "Canadian Dollar" },
      { "code": "CHF", "name": "Swiss Franc" }, { "code": "CNY", "name": "Chinese Yuan" },
      { "code": "CZK", "name": "Czech Koruna" }, { "code": "DKK", "name": "Danish Krone" },
      { "code": "EUR", "name": "Euro" }, { "code": "GBP", "name": "British Pound Sterling" },
      { "code": "HKD", "name": "Hong Kong Dollar" }, { "code": "HUF", "name": "Hungarian Forint" },
      { "code": "IDR", "name": "Indonesian Rupiah" }, { "code": "ILS", "name": "Israeli New Shekel" },
      { "code": "INR", "name": "Indian Rupee" }, { "code": "ISK", "name": "Icelandic Krona" },
      { "code": "JPY", "name": "Japanese Yen" }, { "code": "KRW", "name": "South Korean Won" },
      { "code": "MXN", "name": "Mexican Peso" }, { "code": "MYR", "name": "Malaysian Ringgit" },
      { "code": "NOK", "name": "Norwegian Krone" }, { "code": "NZD", "name": "New Zealand Dollar" },
      { "code": "PHP", "name": "Philippine Peso" }, { "code": "PLN", "name": "Polish Zloty" },
      { "code": "RON", "name": "Romanian Leu" }, { "code": "SEK", "name": "Swedish Krona" },
      { "code": "SGD", "name": "Singapore Dollar" }, { "code": "THB", "name": "Thai Baht" },
      { "code": "TRY", "name": "Turkish Lira" }, { "code": "USD", "name": "United States Dollar" },
      { "code": "ZAR", "name": "South African Rand" }
    ];
    // Apply to current formCount (newly added) or form 0 if it's the initial call
    const currentFormIndex = (formCount === 0 && !document.getElementById(`rate-${formCount}`)) ? 0 : formCount;
    const select = document.getElementById(`rate-${currentFormIndex}`);
    if (select) {
        // Clear existing options if any, except if it's the initial population for form 0
        if (select.options.length > 0 && currentFormIndex !== 0) { // Avoid clearing form 0 if add_cur is called multiple times initially
            // Or simply check if already populated
            if (select.dataset.populated) return;
        }
        for (let i = 0; i < currencies.length; i++) {
            const option = document.createElement('option');
            option.value = currencies[i].code;
            option.textContent = currencies[i].name;
            select.appendChild(option);
        }
        select.value = "USD";
        select.dataset.populated = "true";
    }
}

function valid(value) {
    return /^[1-9]\d*$/.test(value) || value === ''; // Allow empty for temporary input
}
document.addEventListener('input', function(event) {
    const target = event.target;
    if (target.tagName === 'INPUT' && target.type === 'number' && /^cost-\d+$/.test(target.id)) {
      if (!valid(target.value) && target.value !== '') { // Allow clearing the input
        target.value = target.value.slice(0, -1); // Simple way to remove last invalid char
      }
    }
});

function destroy(selectId) { // Called when 'car' is selected for form 'selectId'
    const currentFormIndex = parseInt(selectId, 10);

    const departureAirportItemCurrent = document.getElementById(`departure-airport-item-${currentFormIndex}`);
    if (departureAirportItemCurrent) {
        departureAirportItemCurrent.style.display = 'none';
    }

    const nextFormIndex = currentFormIndex + 1;
    const arrivalAirportItemNext = document.getElementById(`arrival-airport-item-${nextFormIndex}`);
    if (arrivalAirportItemNext) {
        arrivalAirportItemNext.style.display = 'none';
    }
}

function append(selectId) { // Called when 'poliline' is selected for form 'selectId'
    const currentFormIndex = parseInt(selectId, 10);

    const departureAirportItemCurrent = document.getElementById(`departure-airport-item-${currentFormIndex}`);
    if (departureAirportItemCurrent) {
        departureAirportItemCurrent.style.display = 'block'; // Or 'flex' or use CSS class
    }

    const nextFormIndex = currentFormIndex + 1;
    const arrivalAirportItemNext = document.getElementById(`arrival-airport-item-${nextFormIndex}`);
    if (arrivalAirportItemNext) {
        arrivalAirportItemNext.style.display = 'block'; // Or 'flex'
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

// Initial call for form 0 currencies
document.addEventListener('DOMContentLoaded', () => {
    add_cur(); // For form-0
    // Check initial transport type for form-0 and set airport visibility if needed
    const initialTypeWay = document.getElementById('type_way-0');
    if (initialTypeWay) {
        if (initialTypeWay.value === 'car') {
            destroy('0');
        } else {
            append('0'); // Ensures visibility is correct on load
        }
    }
});