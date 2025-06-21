
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets } from "lucide-react";

interface WeatherForecastProps {
  destination: string;
}

const WeatherForecast = ({ destination }: WeatherForecastProps) => {
  // Mock weather data - in a real app, this would come from a weather API
  const weatherData = {
    current: {
      temp: 22,
      condition: "Partly Cloudy",
      humidity: 65,
      windSpeed: 12,
      icon: <Cloud className="w-6 h-6" />
    },
    forecast: [
      { day: "Today", high: 24, low: 18, condition: "Sunny", icon: <Sun className="w-4 h-4" /> },
      { day: "Tomorrow", high: 26, low: 20, condition: "Partly Cloudy", icon: <Cloud className="w-4 h-4" /> },
      { day: "Day 3", high: 21, low: 16, condition: "Light Rain", icon: <CloudRain className="w-4 h-4" /> },
      { day: "Day 4", high: 23, low: 17, condition: "Sunny", icon: <Sun className="w-4 h-4" /> }
    ]
  };

  return (
    <Card className="koncii-card">
      <CardHeader>
        <CardTitle className="text-lg">Weather Forecast</CardTitle>
        <p className="text-sm text-muted-foreground">{destination}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Weather */}
        <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="text-primary">
              {weatherData.current.icon}
            </div>
            <div>
              <p className="font-semibold text-2xl">{weatherData.current.temp}°C</p>
              <p className="text-sm text-muted-foreground">{weatherData.current.condition}</p>
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center text-sm">
              <Droplets className="w-3 h-3 mr-1" />
              {weatherData.current.humidity}%
            </div>
            <div className="flex items-center text-sm">
              <Wind className="w-3 h-3 mr-1" />
              {weatherData.current.windSpeed} km/h
            </div>
          </div>
        </div>

        {/* 4-Day Forecast */}
        <div className="grid grid-cols-4 gap-2">
          {weatherData.forecast.map((day, index) => (
            <div key={index} className="text-center p-3 bg-card/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">{day.day}</p>
              <div className="flex justify-center mb-2 text-primary">
                {day.icon}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold">{day.high}°</p>
                <p className="text-xs text-muted-foreground">{day.low}°</p>
              </div>
            </div>
          ))}
        </div>

        <Badge variant="outline" className="w-full justify-center bg-green-500/10 text-green-700">
          <Thermometer className="w-3 h-3 mr-1" />
          Perfect weather for outdoor activities!
        </Badge>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;
