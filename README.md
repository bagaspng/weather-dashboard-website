# Weather Dashboard

## Overview
The Weather Dashboard is a web application that provides users with current weather data and a 5-day forecast for any city. The application is designed with a responsive layout and a glass UI effect, making it visually appealing and user-friendly.

## Features
- Search for cities to get current weather information and forecasts.
- Toggle between Celsius and Fahrenheit temperature units.
- Dark and light theme options for better accessibility.
- Displays humidity, wind speed, and cloud coverage.
- 5-day weather forecast with daily predictions.

## File Structure
```
weather-dashboard
├── src
│   ├── index.html          # Main HTML document
│   ├── styles
│   │   └── main.css        # CSS styles for the application
│   ├── scripts
│   │   ├── main.js         # Main JavaScript file
│   │   ├── api.js          # API request handling
│   │   └── utils.js        # Utility functions
│   ├── components
│   │   ├── header.js       # Header component
│   │   ├── search.js       # Search component
│   │   └── forecast.js     # Forecast component
│   └── data
│       └── sample.json     # Sample weather data
├── public
│   └── manifest.json       # Web app manifest
├── test
│   └── weather.spec.js     # Unit tests
├── package.json            # npm configuration
├── .gitignore              # Files to ignore in version control
├── .eslintrc.json          # ESLint configuration
└── README.md               # Project documentation
```

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/weather-dashboard.git
   ```
2. Navigate to the project directory:
   ```
   cd weather-dashboard
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
1. Open `src/index.html` in your web browser.
2. Use the search bar to find a city and view its weather information.
3. Toggle between temperature units and themes as desired.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.