let airportCache = {};

// Функция для загрузки данных аэропортов
async function fetchAirports(searchTerm) {
    if (airportCache[searchTerm]) {
        return airportCache[searchTerm];
    }

    try {
        const response = await fetch(`/api/v1/app/new_trip/airport?name=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        airportCache[searchTerm] = data;
        return data;
    } catch (error) {
        console.error('Error fetching airports:', error);
        return [];
    }
}

// Функция для создания dropdown
function createDropdown(id, isIcao = false) {
    const dropdown = document.createElement('div');
    dropdown.className = 'autocomplete-dropdown';
    dropdown.id = `dropdown-${id}`;
    dropdown.style.display = 'none';
    dropdown.style.position = 'absolute';
    dropdown.style.zIndex = '1000';
    dropdown.style.backgroundColor = 'white';
    dropdown.style.border = '1px solid #ddd';
    dropdown.style.maxHeight = '200px';
    dropdown.style.overflowY = 'auto';
    dropdown.style.width = '100%';
    return dropdown;
}

// Функция для отображения подсказок
function showSuggestions(dropdown, suggestions, inputField, linkedField, isIcao = false) {
    dropdown.innerHTML = '';

    suggestions.forEach(airport => {
        const item = document.createElement('div');
        item.style.padding = '8px 12px';
        item.style.cursor = 'pointer';
        item.dataset.icao = airport.icao;
        item.dataset.name = airport.name;

        if (isIcao) {
            item.textContent = `${airport.icao} - ${airport.name}`;
        } else {
            item.textContent = `${airport.name} (${airport.icao})`;
        }

        item.addEventListener('click', () => {
            inputField.value = isIcao ? airport.icao : airport.name;
            if (linkedField) {
                linkedField.value = isIcao ? airport.name : airport.icao;
            }
            dropdown.style.display = 'none';
        });

        dropdown.appendChild(item);
    });

    dropdown.style.display = suggestions.length ? 'block' : 'none';
}

// Инициализация автодополнения для поля
function initAutocomplete(inputField, linkedField, isIcao = false) {
    if (inputField.dataset.autocompleteInitialized === 'true') return;
    inputField.dataset.autocompleteInitialized = 'true';

    const container = inputField.parentElement;
    const dropdown = createDropdown(inputField.id, isIcao);
    container.appendChild(dropdown);
    container.style.position = 'relative';

    inputField.addEventListener('input', async (e) => {
        const searchTerm = e.target.value;
        if (searchTerm.length < 2) {
            dropdown.style.display = 'none';
            return;
        }

        const airports = await fetchAirports(searchTerm);
        showSuggestions(dropdown, airports, inputField, linkedField, isIcao);
    });

    inputField.addEventListener('focus', async () => {
        if (inputField.value.length >= 2) {
            const airports = await fetchAirports(inputField.value);
            showSuggestions(dropdown, airports, inputField, linkedField, isIcao);
        }
    });

    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
}

// Инициализация автодополнения для всех форм
function initAllAutocompletes() {
    // air- и icao-
    document.querySelectorAll('[id^="air-"]').forEach((input) => {
        const linkedId = input.id.replace('air-', 'icao-');
        const linkedField = document.getElementById(linkedId);
        if (input && linkedField) {
            initAutocomplete(input, linkedField, false);
        }
    });

    document.querySelectorAll('[id^="icao-"]').forEach((input) => {
        const linkedId = input.id.replace('icao-', 'air-');
        const linkedField = document.getElementById(linkedId);
        if (input && linkedField) {
            initAutocomplete(input, linkedField, true);
        }
    });

    // air2- и icao2-
    document.querySelectorAll('[id^="air2-"]').forEach((input) => {
        const linkedId = input.id.replace('air2-', 'icao2-');
        const linkedField = document.getElementById(linkedId);
        if (input && linkedField) {
            initAutocomplete(input, linkedField, false);
        }
    });

    document.querySelectorAll('[id^="icao2-"]').forEach((input) => {
        const linkedId = input.id.replace('icao2-', 'air2-');
        const linkedField = document.getElementById(linkedId);
        if (input && linkedField) {
            initAutocomplete(input, linkedField, true);
        }
    });
}

function observeAutocompleteInputs() {
    const observer = new MutationObserver(() => {
        initAllAutocompletes();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initAllAutocompletes();
    observeAutocompleteInputs();
});
