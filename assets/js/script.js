var submitSearchBtn = document.getElementById("searchBtn");
var searchInputValue = document.getElementById("inputName");
var searchHistoryButtons = document.getElementById("history-buttons");
var clickClearBtn = document.getElementById("clearBtn");
var forecastContainer = document.getElementById("forecast-container");

var currentResult = {
    city: "",
    icon: "",
    temp: "",
    wind: "",
    humidity: "",
    uvi: ""
}
var forecastResult = [
    {icon: "", temp: "", wind: "", humidity: ""},
    {icon: "", temp: "", wind: "", humidity: ""},
    {icon: "", temp: "", wind: "", humidity: ""},
    {icon: "", temp: "", wind: "", humidity: ""},
    {icon: "", temp: "", wind: "", humidity: ""}
]

// dummy for testing
var dummycurrentResult = {
    city: "salt lake city",
    icon: "04n",
    temp: "57.27",
    wind: "26.46",
    humidity: "64",
    uvi: "16"
}
var dummyforecastResult = [
    {icon: "10d", temp: "59.54", wind: "26.35", humidity: "50"},
    {icon: "10d", temp: "66.33", wind: "47.76", humidity: "37"},
    {icon: "10d", temp: "45.19", wind: "24.58", humidity: "66"},
    {icon: "10d", temp: "48.94", wind: "13.69", humidity: "60"},
    {icon: "04d", temp: "54.07", wind: "8.46", humidity: "56"}
]

// Create and Display Buttons for Search History
var updateButton = function () {
    var searchHistory = localStorage.getItem("searchHistory");
    
    searchHistoryButtons.innerHTML = "";

    if (searchHistory) {
        var searchHistoryRecord = JSON.parse(searchHistory);
        if (searchHistoryRecord[0]) {
            for (var i = 0; i < searchHistoryRecord.length; i++) {
                var searchHistoryButtonEl = document.createElement("button");
                searchHistoryButtonEl.setAttribute("type", "button");
                searchHistoryButtonEl.setAttribute("class", "btn");
                searchHistoryButtonEl.setAttribute("data-target", searchHistoryRecord[i]);
                searchHistoryButtonEl.textContent = searchHistoryRecord[i];
                searchHistoryButtons.appendChild(searchHistoryButtonEl);
            }
        }
    }   
}

var displayCurrentWeather = function () {
    var PlaceTimeDisplay = document.getElementById("PlaceTime");
    var TempDisplay = document.getElementById("Temp");
    var WindDisplay = document.getElementById("Wind");
    var HumidityDisplay = document.getElementById("Humidity");
    var UVIDisplay = document.getElementById("UVI");

    var WeatherIconDisplay = document.createElement("img");

    var currentDate = moment().format("M/D/Y");
    var targetCity = dummycurrentResult.city;
    var iconLink = "http://openweathermap.org/img/wn/" + dummycurrentResult.icon + "@2x.png";

    WeatherIconDisplay.setAttribute("src", iconLink);
    WeatherIconDisplay.setAttribute("alt", "Weather Icon");
    WeatherIconDisplay.setAttribute("id", "WeatherIcon");
    WeatherIconDisplay.setAttribute("class", "Weather-Icon");
    
    PlaceTimeDisplay.textContent = targetCity + " (" + currentDate + ") ";
    PlaceTimeDisplay.appendChild(WeatherIconDisplay);
    TempDisplay.textContent = dummycurrentResult.temp;
    WindDisplay.textContent = dummycurrentResult.wind;
    HumidityDisplay.textContent = dummycurrentResult.humidity;
    UVIDisplay.textContent = dummycurrentResult.uvi;

    if (dummycurrentResult.uvi < 2.5) {
        UVIDisplay.setAttribute("style", "background : green");
    } else {
        if (dummycurrentResult.uvi < 5.5) {
            UVIDisplay.setAttribute("style", "background : yellow");
        } else {
            if (dummycurrentResult.uvi < 7.5) {
                UVIDisplay.setAttribute("style", "background : orange");
            } else {
                if (dummycurrentResult.uvi < 10.5) {
                    UVIDisplay.setAttribute("style", "background : red");
                } else {
                    UVIDisplay.setAttribute("style", "background : violet");
                }
            }
        }
    }
}

var displayForecastWeather = function (i) {
    var iconLink = "http://openweathermap.org/img/wn/" + dummyforecastResult[i].icon + "@2x.png";

    var WeatherCard = document.createElement("div");
    var DateDisplay = document.createElement("h3");
    var IconDisplay = document.createElement("img");
    var TempDisplay = document.createElement("h5");
    var WindDisplay = document.createElement("h5");
    var HumidityDisplay = document.createElement("h5");

    WeatherCard.setAttribute("class", "forecast-card");
    DateDisplay.textContent = moment().add(i + 1, "days").format("M/D/Y");
    IconDisplay.setAttribute("src", iconLink);
    IconDisplay.setAttribute("alt", "Weather Icon");
    IconDisplay.setAttribute("id", "WeatherIcon" + i);
    IconDisplay.setAttribute("class", "Weather-Icon");
    TempDisplay.textContent = "Temp: " + dummyforecastResult[i].temp + " ℉";
    WindDisplay.textContent = "Wind: " + dummyforecastResult[i].wind + " MPH";
    HumidityDisplay.textContent = "Humidity: " + dummyforecastResult[i].humidity + " %";

    forecastContainer.appendChild(WeatherCard);
    WeatherCard.appendChild(DateDisplay);
    WeatherCard.appendChild(IconDisplay);
    WeatherCard.appendChild(TempDisplay);
    WeatherCard.appendChild(WindDisplay);
    WeatherCard.appendChild(HumidityDisplay);
}

// Display Weather Data on the Page
var displayWeather = function () {
    displayCurrentWeather();
    for (var i = 0; i < 5; i++) {
        displayForecastWeather(i);
    }
}

// Clear Local Storage
var clearSearchHistory = function () {
    localStorage.setItem("searchHistory", "");
    updateButton();
}

// Get all the weather data
//  -> fetch data with latitude and longitude
//  -> Get the weather data
//  -> Call display weather
var searchWeather = function (lat, lon) {
    console.log("Searching Local Weather ...");
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="
    + lat + "&lon=" + lon + "&exclude=hourly,minutely&units=imperial&appid=7888b0b3f54eed5b3244e18d1cfc2e1d";

    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
          response.json().then(function(data) {
            
            // Get today's weather
            currentResult.icon = data.current.weather[0].icon;
            currentResult.temp = data.current.temp;
            currentResult.wind = data.current.wind_gust;
            currentResult.humidity = data.current.humidity;
            currentResult.uvi = data.current.uvi;

            // Get the 5 day forecast
            for (var i = 0; i < 5; i++) {
                forecastResult[i].icon = data.daily[i].weather[0].icon;
                forecastResult[i].temp = data.daily[i].temp.day;
                forecastResult[i].wind = data.daily[i].wind_gust;
                forecastResult[i].humidity = data.daily[i].humidity;
            }

            displayWeather();
          });
        }
        else {
            console.log("Open Weather Map is having trouble.");
        }
    });
    
}

// Get the latitude and longitude of the searching city
//  -> fetch data with city name
//  -> extract the latitude and longitude
//  -> call function searchWeather
var searchCity = function (targetCity) {
    var apiUrl = "http://api.positionstack.com/v1/forward?access_key=f59818feb06f5f1f15fb99327eca6c1b&query=" + targetCity + "&limit=1";

    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
          response.json().then(function(data) {
            // Get latitude and longitude to search weather
            var lat = data.data[0].latitude;
            var lon = data.data[0].longitude;
            searchWeather(lat, lon);
          });
        }
        else {
            console.log("Position Stack is having trouble.");
        }
    });
}

// Master function triggered by Search Button
//  -> no real response if input value is empty string
//  -> if input value is valid
//      -> store input value to local storage
//      -> create button for the search history
//      -> call function searchCity
var masterSearch = function (event) {
    event.preventDefault();

    if (searchInputValue.value) {

        var searchHistory = localStorage.getItem("searchHistory");
        currentResult.city = searchInputValue.value;

        if (!searchHistory) {
            var temp = [];
            temp.push(searchInputValue.value);
            localStorage.setItem("searchHistory", JSON.stringify(temp));
        } else {
            var searchHistoryRecord = JSON.parse(searchHistory);
            if (searchHistoryRecord) {
                var flag = true;
                for (var i = 0; i < searchHistoryRecord.length; i++) {
                    if (searchHistoryRecord[i] == searchInputValue.value) {
                        flag = false;
                    }
                }
                if (flag) {
                    searchHistoryRecord.push(searchInputValue.value);
                }
                localStorage.setItem("searchHistory", JSON.stringify(searchHistoryRecord));
            } else {
                temp = [];
                temp.push(searchInputValue.value);
                localStorage.setItem("searchHistory", JSON.stringify(temp));
            }
        }
        updateButton();
        searchCity(searchInputValue.value);
    }
}

// Function triggered by Search History Buttons
//  -> Get the Location Info Stored in the button
//  -> Call searchCity with it
var searchFromHistory = function (event) {

    if (event.target.className == "btn") {
        var targetCity = event.target.getAttribute("data-target");
        searchCity(targetCity);
    }
}

submitSearchBtn.addEventListener("click", masterSearch);
searchHistoryButtons.addEventListener("click", searchFromHistory);
clickClearBtn.addEventListener("click", clearSearchHistory);

updateButton();
displayWeather();