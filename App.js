import { getPermissionsAsync } from "expo-location";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import {Fontisto} from '@expo/vector-icons';
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "d0cbecf1bd590cf05ec900140904a552";
const icons = {
  Clouds : "cloudy",
  Clear : "day-sunny",
  Atmosphere : "cloudy-gusts",
  Snow : "snow",
  Rain : "rains",
  Drizzle : "rain",
  Thunderstorm : "lightning"
}

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const ask = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );

    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alert&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();

    setDays(json.daily);
  };

  useEffect(() => {
    ask();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.city}>
          <Text style={styles.cityName}>{city}</Text>
        </View>
        <ScrollView
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={styles.weather}
        >
          {days.length === 0 ? (
            <View style={styles.day}>
              <ActivityIndicator color="white" size="large" />
            </View>
          ) : (
            days.map((day, index) => (
              <View key={index} style={styles.day}>
                <View style = {styles.left}>
                <View style = {{flexDirection : 'row',alignItems : 'center'}}>
                <Text style ={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                <Fontisto name={icons[day.weather[0].main]} size={68} color ="white" ></Fontisto>
                </View>
                <Text style ={styles.description}>{day.weather[0].main}</Text>
                <Text style= {styles.tinyText}>{day.weather[0].description}</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      <StatusBar style="light"></StatusBar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    color: "white",
    fontSize: 68,
    fontWeight: "600",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    
    color: "white",
  },
  temp: {
    marginTop: 50,
    fontSize: 100,
    fontWeight : "bold",
    color: "white",
  },
  left : {
    marginLeft : 30
  },
  description: {
    marginTop: -30,
    fontSize: 60,
    color: "white",
  },
  tinyText :{
    fontSize : 30,
    marginTop: -10,
    marginLeft : 5,
    color: "white",
  }
});
