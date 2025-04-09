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

async function change_rate(){
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
  const select = document.getElementById('selector');
  for (let i = 0; i < currencies.length; i++) {
    const option = document.createElement('option');
    option.value = currencies[i].code;
    option.textContent = currencies[i].name;
    select.appendChild(option);
  }
  select.value = "USD";
}

change_rate();
let flag_change = document.getElementById('selector');
flag_change.addEventListener('change', function(e) {
   let to = document.getElementById('selector').value;
   let currency = document.getElementById('summary').textContent;
   let from = document.getElementById('rater').textContent;
   if (to == "USD" && from == "USD") {
       console.log('cant convert');
   } else {
       let was_converted = convert(from, to, currency).then(data => {
           let sum = data;
           console.log(data);
           if (isNaN(sum)) {
               console.log("send-api-error");
           } else {
               document.getElementById('summary').innerText = sum;
               document.getElementById('rater').innerText = to;
               const select = document.getElementById('selector');
               select.disabled = true;
               setTimeout(function() {
                   select.disabled = false;
               }, 7000);
           }
       });
   }
});
