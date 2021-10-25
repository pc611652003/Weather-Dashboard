var submitSearchBtn = document.getElementById("searchBtn");
var searchInputValue = document.getElementById("inputName");
var searchHistoryButtons = document.getElementById("history-buttons");
var clickClearBtn = document.getElementById("clearBtn");

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
    uvi: "0"
}
var dummyforecastResult = [
    {icon: "10d", temp: "59.54", wind: "26.35", humidity: "50"},
    {icon: "10d", temp: "66.33", wind: "47.76", humidity: "37"},
    {icon: "10d", temp: "45.19", wind: "24.58", humidity: "66"},
    {icon: "10d", temp: "48.94", wind: "13.69", humidity: "60"},
    {icon: "04d", temp: "54.07", wind: "8.46", humidity: "56"}
]


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

var displayWeather = function () {
    console.log("Displaying stuff!");
}

var clearSearchHistory = function () {
    localStorage.setItem("searchHistory", "");
    updateButton();
}

var searchWeather = function (lat, lon) {
    console.log("Searching Local Weather ...");
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="
    + lat + "&lon=" + lon + "&exclude=hourly,minutely&units=imperial&appid=7888b0b3f54eed5b3244e18d1cfc2e1d";

    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
          response.json().then(function(data) {
            console.log("Waiting");
            console.log(data);
            // pass response data to dom function
            currentResult.icon = data.current.weather[0].icon;
            currentResult.temp = data.current.temp;
            currentResult.wind = data.current.wind_gust;
            currentResult.humidity = data.current.humidity;
            currentResult.uvi = data.current.uvi;

            for (var i = 0; i < 5; i++) {
                forecastResult[i].icon = data.daily[i].weather[0].icon;
                forecastResult[i].temp = data.daily[i].temp.day;
                forecastResult[i].wind = data.daily[i].wind_gust;
                forecastResult[i].humidity = data.daily[i].humidity;
            }
          });
        }
        else {
            console.log("Open Weather Map is having trouble.");
        }
    });
    displayWeather();
}

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

var masterSearch = function (event) {
    event.preventDefault();

    var searchHistory = localStorage.getItem("searchHistory");
    currentResult.city = searchInputValue.value;

    if (searchInputValue.value) {
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

submitSearchBtn.addEventListener("click", masterSearch);
clickClearBtn.addEventListener("click", clearSearchHistory);

updateButton();