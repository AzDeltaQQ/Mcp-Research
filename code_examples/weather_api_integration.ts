// Integration Example: MCP Server for Cursor AI with External API
// This example demonstrates how to create an MCP server that integrates with an external API

import axios from 'axios';
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Define our resource namespace
const RESOURCE_NAMESPACE = "cursor://weather";

// Main function to start the server
async function main() {
  // Create server with stdio transport
  const transport = new StdioServerTransport();
  const server = new Server({ transport });
  
  // Register weather lookup tool
  server.registerTool({
    name: `${RESOURCE_NAMESPACE}/get_weather`,
    description: "Get current weather information for a location",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "City name or location (e.g., 'New York', 'London, UK')"
        },
        units: {
          type: "string",
          description: "Units for temperature (metric, imperial, or standard)",
          enum: ["metric", "imperial", "standard"],
          default: "metric"
        }
      },
      required: ["location"]
    },
    handler: async (params) => {
      const { location, units = "metric" } = params;
      
      // API key should be stored securely, e.g., in environment variables
      // For this example, we're using a placeholder
      const API_KEY = process.env.OPENWEATHER_API_KEY || "your_api_key_here";
      
      try {
        // Make API request to OpenWeatherMap
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: {
            q: location,
            units: units,
            appid: API_KEY
          }
        });
        
        const data = response.data;
        
        // Format the response
        return {
          location: `${data.name}, ${data.sys.country}`,
          temperature: {
            current: data.main.temp,
            feelsLike: data.main.feels_like,
            min: data.main.temp_min,
            max: data.main.temp_max,
            unit: units === 'metric' ? '°C' : units === 'imperial' ? '°F' : 'K'
          },
          humidity: data.main.humidity,
          wind: {
            speed: data.wind.speed,
            unit: units === 'metric' ? 'm/s' : 'mph',
            direction: data.wind.deg
          },
          conditions: {
            main: data.weather[0].main,
            description: data.weather[0].description,
            icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
          },
          timestamp: new Date(data.dt * 1000).toISOString()
        };
      } catch (error) {
        // Handle API errors
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          throw new Error(`Weather API error: ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          // The request was made but no response was received
          throw new Error('No response from weather service. Please check your internet connection.');
        } else {
          // Something happened in setting up the request that triggered an Error
          throw new Error(`Error fetching weather data: ${error.message}`);
        }
      }
    }
  });
  
  // Register forecast tool
  server.registerTool({
    name: `${RESOURCE_NAMESPACE}/get_forecast`,
    description: "Get 5-day weather forecast for a location",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "City name or location (e.g., 'New York', 'London, UK')"
        },
        units: {
          type: "string",
          description: "Units for temperature (metric, imperial, or standard)",
          enum: ["metric", "imperial", "standard"],
          default: "metric"
        },
        days: {
          type: "number",
          description: "Number of days to forecast (1-5)",
          minimum: 1,
          maximum: 5,
          default: 3
        }
      },
      required: ["location"]
    },
    handler: async (params) => {
      const { location, units = "metric", days = 3 } = params;
      
      // API key should be stored securely
      const API_KEY = process.env.OPENWEATHER_API_KEY || "your_api_key_here";
      
      try {
        // Make API request to OpenWeatherMap 5-day forecast
        const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
          params: {
            q: location,
            units: units,
            appid: API_KEY
          }
        });
        
        const data = response.data;
        
        // Process the forecast data
        // The API returns forecast in 3-hour steps, so we need to aggregate by day
        const forecastMap = new Map();
        
        // Group forecast data by day
        data.list.forEach(item => {
          const date = new Date(item.dt * 1000);
          const day = date.toISOString().split('T')[0]; // YYYY-MM-DD
          
          if (!forecastMap.has(day)) {
            forecastMap.set(day, {
              date: day,
              temperatures: [],
              conditions: [],
              humidity: [],
              wind: []
            });
          }
          
          const dayData = forecastMap.get(day);
          dayData.temperatures.push(item.main.temp);
          dayData.conditions.push(item.weather[0].main);
          dayData.humidity.push(item.main.humidity);
          dayData.wind.push(item.wind.speed);
        });
        
        // Convert map to array and sort by date
        const forecastArray = Array.from(forecastMap.values())
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(0, days); // Limit to requested number of days
        
        // Calculate daily averages and most common condition
        const forecast = forecastArray.map(day => {
          // Find most common weather condition
          const conditionCounts = day.conditions.reduce((acc, condition) => {
            acc[condition] = (acc[condition] || 0) + 1;
            return acc;
          }, {});
          
          const mostCommonCondition = Object.entries(conditionCounts)
            .sort((a, b) => b[1] - a[1])[0][0];
          
          // Calculate averages
          const avgTemp = day.temperatures.reduce((sum, temp) => sum + temp, 0) / day.temperatures.length;
          const avgHumidity = day.humidity.reduce((sum, hum) => sum + hum, 0) / day.humidity.length;
          const avgWind = day.wind.reduce((sum, wind) => sum + wind, 0) / day.wind.length;
          
          return {
            date: day.date,
            temperature: {
              average: Math.round(avgTemp * 10) / 10,
              unit: units === 'metric' ? '°C' : units === 'imperial' ? '°F' : 'K'
            },
            condition: mostCommonCondition,
            humidity: Math.round(avgHumidity),
            wind: {
              speed: Math.round(avgWind * 10) / 10,
              unit: units === 'metric' ? 'm/s' : 'mph'
            }
          };
        });
        
        return {
          location: `${data.city.name}, ${data.city.country}`,
          forecast: forecast
        };
      } catch (error) {
        // Handle API errors
        if (error.response) {
          throw new Error(`Weather API error: ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          throw new Error('No response from weather service. Please check your internet connection.');
        } else {
          throw new Error(`Error fetching forecast data: ${error.message}`);
        }
      }
    }
  });
  
  // Start the server
  try {
    await server.start();
    console.error("Weather MCP Server started successfully");
  } catch (error) {
    console.error("Failed to start MCP server:", error);
    process.exit(1);
  }
}

// Run the server
main();
