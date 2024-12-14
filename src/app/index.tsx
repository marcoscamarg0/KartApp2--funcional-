import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StatusBar, Image, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';
import tw from 'twrnc';
import * as Location from 'expo-location';
import RankingList from './RankingList';

const { width, height } = Dimensions.get('window');

const RaceDashboard = () => {
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [currentLapTime, setCurrentLapTime] = useState('0:00');
  const [runners, setRunners] = useState([
    { id: 1, name: 'CORREDOR 1', time: ""},
    { id: 2, name: 'CORREDOR 2', time: ""},
    { id: 3, name: 'CORREDOR 3', time: ""},
    { id: 4, name: 'CORREDOR 4', time: ""},
    { id: 5, name: 'CORREDOR 5', time: ""},
    { id: 6, name: 'CORREDOR 6', time: ""},
  ]);

  const [location, setLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const locationSubscription = useRef(null);
  const lapTimeInterval = useRef(null);

  // Função para calcular a distância entre dois pontos geográficos
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Função para atualizar o cronômetro da volta atual
  const updateLapTime = () => {
    const now = new Date();
    const lapTime = now.getTime() - (location?.timestamp || now.getTime());
    const minutes = Math.floor(lapTime / 60000);
    const seconds = ((lapTime % 60000) / 1000).toFixed(0);
    setCurrentLapTime(`${minutes}:${seconds.padStart(2, '0')}`);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'É necessário permitir o acesso à localização.');
        return;
      }

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1
        },
        (newLocation) => {
          const speedKmh = newLocation.coords.speed
            ? (newLocation.coords.speed * 3.6).toFixed(1)
            : '0';
          setCurrentSpeed(parseFloat(speedKmh));

          // Atualizar rota, distância e cronômetro
          if (location) {
            const distance = calculateDistance(
              location.coords.latitude, 
              location.coords.longitude, 
              newLocation.coords.latitude, 
              newLocation.coords.longitude
            );
            
            setTotalDistance(prevDistance => prevDistance + distance);
            setRoute(prevRoute => [
              ...prevRoute, 
              {
                latitude: newLocation.coords.latitude, 
                longitude: newLocation.coords.longitude
              }
            ]);
            updateLapTime();
          }

          setLocation(newLocation);
        }
      );

      // Iniciar o cronômetro da volta
      lapTimeInterval.current = setInterval(updateLapTime, 100);
    })();

    // Limpar inscrição de localização e cronômetro ao desmontar
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
      if (lapTimeInterval.current) {
        clearInterval(lapTimeInterval.current);
      }
    };
  }, []);

  return (
    <View style={tw`flex-1 bg-black items-center justify-center p-4`}>
      <StatusBar barStyle="light-content" />
      <View style={[
        tw`w-full bg-gray-900 rounded-lg p-4`,
        { width: width * 1, height: height * 1 }
      ]}>
        <View style={tw`flex-row justify-between items-center mb-4`}>
          <TouchableOpacity>
            <FontAwesome name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <View style={tw`items-center`}>
            <Text style={tw`text-orange-500 text-3xl font-bold`}>{currentSpeed} KM/H</Text>
          </View>
        </View>

        <View style={tw`flex-row justify-between mb-4`}>
          <View style={tw`bg-gray-800 p-4 rounded-lg w-[48%]`}>
            <Text style={tw`text-orange-500 text-lg`}>DISTÂNCIA</Text>
            <Text style={tw`text-white text-3xl font-bold`}>{totalDistance.toFixed(2)} KM</Text>
          </View>
          <View style={tw`bg-gray-800 p-4 rounded-lg w-[48%]`}>
            <Text style={tw`text-orange-500 text-lg`}>VOLTA ATUAL</Text>
            <Text style={tw`text-white text-3xl font-bold`}>{currentLapTime}</Text>
          </View>
        </View>

        <RankingList runners={runners} />

        <View style={tw`mb-4`}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={[tw`w-full rounded-lg`, { height: height * 0.25 }]}
            initialRegion={location ? {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            } : {
              latitude: -34.397,
              longitude: 150.644,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {route.length > 0 && (
              <Polyline
                coordinates={route}
                strokeColor="#F97316" // Cor laranja para a rota
                strokeWidth={5}
              />
            )}
            {location && (
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude
                }}
                title="Sua Posição"
                pinColor="#F97316"
              />
            )}
          </MapView>
        </View>

        <View style={tw`items-center`}>
          <Image
            source={require('../assets/logo.png')}
            style={tw`w-30 h-30`}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
};

export default RaceDashboard;