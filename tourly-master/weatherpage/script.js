document.getElementById('searchForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const location = document.getElementById('locationInput').value.trim();
    const apiKey = '060cfd103fbfb2dece29cad9660588b0'; // Your API Key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Location not found');
      
      const data = await response.json();
      displayWeather(data);
    } catch (error) {
      alert(error.message);
    }
  });
  
  function displayWeather(data) {
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°C`;
    document.getElementById('description').textContent = `Description: ${data.weather[0].description}`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind').textContent = `Wind Speed: ${data.wind.speed} m/s`;
  
    document.getElementById('weatherInfo').classList.remove('hidden');
  }
  