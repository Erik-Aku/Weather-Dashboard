var searchFormEl = document.querySelector('#search-form');
var showCurrentEl = document.querySelector('#show-today');
var forecastContainerEl = document.querySelector('#forecast');
var lat;
var lon;
var now = dayjs().format('MM/DD/YYYY');

function searchFormSubmit(event) {
    event.preventDefault();

    var searchInputEl = document.querySelector('#search-input').value;
    console.log(searchInputEl)

    if (!searchInputEl) {
        alert('Enter a City');
        return
    } else {
        showCurrentEl.textContent = '';
        forecastContainerEl.textContent = '';
        getCoordinates(searchInputEl);
    }

}

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

function displayForecast(data) {
    if (data.length === 0 ) {
        showCurrentEl.textContent = 'No Forecast data For City';
        return;
    }

    var forecastDiv = document.createElement('div');
    var cardGroupDivEl = document.createElement('div')
    cardGroupDivEl.classList='card-group'
    var forecastHeader = document.createElement('h4');
    forecastHeader.textContent = '5-Day Forecast:'
    forecastHeader.classList='p-3 mt-3'

    forecastContainerEl.appendChild(forecastDiv);
    forecastDiv.appendChild(forecastHeader);
    forecastDiv.appendChild(cardGroupDivEl);

    console.log(data.list[0].dt)


    // for (var i = 0; i < data.list.length; i++) {
    //     offsetDate = data[i].list.dt;
    //     console.log
    // }

    for (var i = 0; i < data.list.length; i++) {
        var dayData = data.list[i];
        var dayTimeUTC = dayData.dt;
        var timeZoneOffset = data.city.timezone;
        var timeZoneOffsetHours = timeZoneOffset / 60 / 60;
        var thisMoment = moment.unix(dayTimeUTC).utc().utcOffset(timeZoneOffsetHours);
        var cardDate =  thisMoment.format('MM/DD/YY');
        
        var iconURL = "https://openweathermap.org/img/w/" + dayData.weather[0].icon + ".png";
       console.log(dayData)
    //   console.log(dayTimeUTC)
    //   console.log(timeZoneOffset)
    //   console.log(timeZoneOffsetHours)
    //   console.log(thisMoment)
    //    var display = thisMoment.format("HH:mm:ss")
    //    console.log(display)
    

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

