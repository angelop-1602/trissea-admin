// src/components/dashboard/overview/weather.tsx
'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';

// Define the types for the weather data
interface WeatherData {
    location: {
        name: string;
    };
    current: {
        temp_c: number;
        condition: {
            text: string;
        };
    };
}

// Define the props type
interface WeatherProps {
    destination: string; // Specify that destination is a string
}

export const Weather: React.FC<WeatherProps> = ({ destination }) => {
    const [weather, setWeather] = useState<WeatherData | null>(null); // Set initial state to null or WeatherData
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null); // Set initial error state to null

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                setLoading(true);
                const apiKey = 'f4e8aea6f9ad4883958143916240411'; // Replace with your WeatherAPI key
                const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${destination}`);
                setWeather(response.data);
            } catch (err) {
                setError(err as Error); // Cast error to Error type
            } finally {
                setLoading(false);
            }
        };

        if (destination) {
            fetchWeather();
        }
    }, [destination]);

    return (
        <Card sx={{ padding: 2, marginBottom: 2, height: '100%' }}>
            <CardContent>
                {loading && <CircularProgress />}
                {error && <Alert severity="error">Error fetching weather data: {error.message}</Alert>}
                {weather && (
                    <div>
                        <Typography variant="h5">Weather in {weather.location.name}</Typography>
                        <Typography variant="h6">Temperature: {weather.current.temp_c}°C</Typography>
                        <Typography variant="body1">Condition: {weather.current.condition.text}</Typography>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};