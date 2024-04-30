const searchBtn = document.querySelector(".search-btn");
const cityInput = document.querySelector(".city-input");
const currentWeatherDiv = document.querySelector(".current-weather")
const weatherCardsDiv = document.querySelector(".weather-cards")
const locationbtn = document.querySelector(".location-btn")




// changing weather cards 

const createWeatherCard = (cityName,weatherItem, index) =>{
   if (index === 0) { // html for current weather
       
       return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>${weatherItem.weather[0].description}</h6>
                </div>`;
       
   }else{// html for 5 days forecast
       return `<li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </li>`;
   }
    

}

//getting weather details for 5 days

const getWeatherDetails = (cityName, lat, lon) => {
 
  const weather5api = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}`;
 
 
  fetch(weather5api)
    .then((res) => res.json())
    .then((data) => {
      
      // filtering weather details for each date
      
      const uniqueForecastDate = [];
      
      const fiveDaysForecast = data.list.filter((forecast) => {
       
        const forecastDate = new Date(forecast.dt_txt).getDate();
       
        if (!uniqueForecastDate.includes(forecastDate)) {
          return uniqueForecastDate.push(forecastDate);
       
        }
      });
      
      
      // clearing previous values
      cityInput.value = "";
      weatherCardsDiv.innerHTML = "";
      currentWeatherDiv.innerHTML = "";
      
      // passing data to create card
      fiveDaysForecast.forEach((weatherItem,index) =>{
        if (index === 0) { // for current weather
            currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
        }else{ 
        //for 5 days forecast
        weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
     }
      })
   
    })
    .catch((err) => {
      console.log(err);
    });
    
};

//getting geocoordinates of the city

const getCoordinates = () => {
  
  const cityName = cityInput.value.trim(); // triming whitespaces from the city name input by user
  
  if (!cityName) return; // if cityname is not given return

  const geocoding_url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apikey}`;

  fetch(geocoding_url)
    .then((res) => res.json())
    .then((data) => {
    
      if (!data.length) return alert(`there is no ${cityName}`);
      
      const { name, lat, lon } = data[0];
      getWeatherDetails(name, lat, lon);
      //   console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords; // Get coordinates of user location
            // Get city name from coordinates using reverse geocoding API
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;
            fetch(API_URL)
                .then(response => response.json())
                .then(data => {
                    const { name } = data[0];
                    getWeatherDetails(name, latitude, longitude);
                })
                .catch(() => {
                    alert("An error occurred while fetching the city name!");
                });
        },
        error => { // Show alert if user denied the location permission
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        }
    );
}

searchBtn.addEventListener("click", getCoordinates);
locationbtn.addEventListener("click", getUserCoordinates);
