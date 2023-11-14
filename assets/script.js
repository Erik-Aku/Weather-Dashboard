var searchFormEl = document.querySelector('#search-form');
var showCurrentEl = document.querySelector('#show-today');
var forecastContainerEl = document.querySelector('#forecast');
var lat;
var lon;
var now = dayjs().format('MM/DD/YYYY');

// on Submit it resets clears the results from the previous search, calls the getCoordinates function
function searchFormSubmit(event) {
    event.preventDefault();

    var searchInputEl = document.querySelector('#search-input').value;

    if (!searchInputEl) {
        alert('Enter a City');
        return
    } else {
        showCurrentEl.textContent = '';
        forecastContainerEl.textContent = '';
        getCoordinates(searchInputEl);
    }

}

// calls the open Weather api with the user input, extracts the lat and lon for that city, calls the getCurrent and getForecast functions
function getCoordinates(searchInput) {
    var apiUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + searchInput + '&limit=1&appid=d04c7278addcd711be0869a0c217a78a';

    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function (data) {
             lon =  (data[0].lon)
             lat = (data[0].lat)

            getCurrent(lat, lon);
            getForecast(lat, lon);
            });
        } else {
            alert('Error:' + response.statusText);
        }
    });
}

// calls the open Weather api with the lat and lon to get the current weather data, calls displayCurrent function
function getCurrent() {
var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=imperial' + '&appid=d04c7278addcd711be0869a0c217a78a'

fetch(apiUrl)
.then(function(response) {
    if (response.ok) {
        response.json().then(function(data) {
            displayCurrent(data);
        })
    } else {
        alert('Error:' + response.statusText);
    }
})
}

// creates elements on the pate and displays the current weather data along with some styling.
function displayCurrent(data) {
    // console.log(data)
    if (data.length === 0) {
        showCurrentEl.textContent = 'No Data For City';
        return;
    }
var addCurrentUl = document.createElement('ul');
var addCurrentLi1 = document.createElement('li');
var addCurrentLi2 = document.createElement('li');
var addCurrentLi3 = document.createElement('li');
var addCurrentDiv = document.createElement('div')

addCurrentDiv.classList='border p-2 mt-3';
addCurrentUl.className='list-group';
addCurrentLi1.classList='list-group-item';
addCurrentLi2.classList='list-group-item';
addCurrentLi3.classList='list-group-item';


var city = data.name;
var temp = data.main.temp;
var wind = data.wind.speed;
var humidity = data.main.humidity;

var titleEl = document.createElement('h2')
titleEl.classList = 'p-3'
// using dayjs to display current date for the current weather section
titleEl.textContent = city + ' ' +'('+ now + ')';

addCurrentLi1.textContent = 'Temp: ' + temp + ' F';
addCurrentLi2.textContent = 'Wind: ' + wind + ' ' + 'MPH';
addCurrentLi3.textContent = 'Humidity: ' + humidity + '%'

showCurrentEl.appendChild(addCurrentDiv);
addCurrentDiv.appendChild(titleEl)
addCurrentDiv.appendChild(addCurrentUl);
addCurrentUl.appendChild(addCurrentLi1);
addCurrentUl.appendChild(addCurrentLi2);
addCurrentUl.appendChild(addCurrentLi3);
}

// gets the 5 day weather forecast with the lat and lon data and calls the displayForecast function
function getForecast(lat, lon) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+ lat + '&lon=' + lon +'&units=imperial' + '&appid=d04c7278addcd711be0869a0c217a78a';

    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayForecast(data);
                console.log(data)
            })
        } else {
            alert('Error:' + response.statusText);
        }
    })
}

// displays the 5 day forecast on the page,
function displayForecast(data) {
    if (data.length === 0 ) {
        showCurrentEl.textContent = 'No Forecast data For City';
        return;
    }

// creating static elements on page to display data
    var forecastDiv = document.createElement('div');
    var cardGroupDivEl = document.createElement('div')
    cardGroupDivEl.classList='card-group'
    var forecastHeader = document.createElement('h4');
    forecastHeader.textContent = '5-Day Forecast:'
    forecastHeader.classList='p-3 mt-3'

    forecastContainerEl.appendChild(forecastDiv);
    forecastDiv.appendChild(forecastHeader);
    forecastDiv.appendChild(cardGroupDivEl);

// loop through data, using momentjs to convert the Unix timestamp, create elements to display 5 day forecast on page
    for (var i = 0; i < data.list.length; i++) {
        var dayData = data.list[i];
        var dayTimeUTC = dayData.dt;
        var timeZoneOffset = data.city.timezone;
        var timeZoneOffsetHours = timeZoneOffset / 60 / 60;
        var thisMoment = moment.unix(dayTimeUTC).utc().utcOffset(timeZoneOffsetHours);
        var cardDate =  thisMoment.format('MM/DD/YY');
        var iconURL = "https://openweathermap.org/img/w/" + dayData.weather[0].icon + ".png";
       console.log(dayData)
    
// Only displaying weather data for 10am or 11am
        if (thisMoment.format("HH:mm:ss") === "10:00:00" || thisMoment.format("HH:mm:ss") === "11:00:00") {
            var cardDivEl = document.createElement('div');
            cardDivEl.classList='card m-2 border';
            
            cardGroupDivEl.appendChild(cardDivEl);

            var cardBodyDivEl = document.createElement('div');
            cardBodyDivEl.classList='card-body';
            cardBodyDivEl.style.cssText='width:200px;';
            cardDivEl.appendChild(cardBodyDivEl);

            var cardTitle = document.createElement('h5')
            cardTitle.textContent = cardDate;
            cardBodyDivEl.appendChild(cardTitle);

            var cardBodyUl = document.createElement('ul');
            cardBodyUl.classList='cardBodyUl p-1';
            cardBodyDivEl.appendChild(cardBodyUl);

            var weatherIconLi = document.createElement('li');
            weatherIconLi.classList='text-center p-1'
            cardBodyUl.appendChild(weatherIconLi);

            var iconImg = document.createElement('img');
            iconImg.setAttribute("src", iconURL);
            weatherIconLi.append(iconImg);

            var addforecastLi1 = document.createElement('li');
            addforecastLi1.textContent = 'Temp: ' + dayData.main.feels_like +'F';
            addforecastLi1.classList='text-center p-1';
            cardBodyUl.appendChild(addforecastLi1);

            var addforecastLi2 = document.createElement('li');
            addforecastLi2.textContent = 'Wind: ' + dayData.wind.speed +' MPH';
            addforecastLi2.classList='text-center p-1';
            cardBodyUl.appendChild(addforecastLi2);

            var addforecastLi3 = document.createElement('li');
            addforecastLi3.textContent = 'Humidity: ' + dayData.main.humidity +'%';
            addforecastLi3.classList='text-center p-1';
            cardBodyUl.appendChild(addforecastLi3);

        


        }
        
    }


}

searchFormEl.addEventListener('submit', searchFormSubmit);

