var submitSearchBtn = document.getElementById("searchBtn");
var searchInputValue = document.getElementById("inputName");
var searchHistoryButtons = document.getElementById("history-buttons");
var clickClearBtn = document.getElementById("clearBtn");

var currentResult = {
    city: "",
    temp: "",
    wind: "",
    humidity: "",
    uni: ""
}
var forecastResult = [
    {temp: "", wind: "", humidity: ""},
    {temp: "", wind: "", humidity: ""},
    {temp: "", wind: "", humidity: ""},
    {temp: "", wind: "", humidity: ""},
    {temp: "", wind: "", humidity: ""}
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
    displayWeather();
}

var searchCity = function (targetCity) {
    var apiUrl = "http://api.positionstack.com/v1/forward?access_key=f59818feb06f5f1f15fb99327eca6c1b&query=" + targetCity + "&limit=1";

    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
          response.json().then(function(data) {
            // pass response data to dom function
            var lat = data.data[0].latitude;
            var lon = data.data[0].longitude;
            searchWeather(lat, lon);
          });
        }
        else {
            console.log("You are in trouble!");
        }
    });
}

submitSearchBtn.addEventListener("click", function(event) {
    event.preventDefault();

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
})

clickClearBtn.addEventListener("click", clearSearchHistory);

updateButton();