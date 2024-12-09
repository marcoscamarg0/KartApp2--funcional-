import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StatusBar, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';
import tw from 'twrnc';
import * as Location from 'expo-location';
import RankingList from './RankingList'; // Import the new component

const { width, height } = Dimensions.get('window');

const RaceDashboard = () => {
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [runners, setRunners] = useState([
    { id: 1, name: 'CORREDOR 1', time: ""},
    { id: 2, name: 'CORREDOR 2', time: ""},
    { id: 3, name: 'CORREDOR 3', time: ""},
    { id: 4, name: 'CORREDOR 4', time: ""},
    { id: 5, name: 'CORREDOR 5', time: ""},
    { id: 6, name: 'CORREDOR 6', time: ""},
  ]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1
        },
        (location) => {
          const speedKmh = location.coords.speed
            ? (location.coords.speed * 3.6).toFixed(1)
            : '0';
          setCurrentSpeed(parseFloat(speedKmh));
        }
      );
    })();
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
            <Text style={tw`text-orange-500 text-lg`}>MELHOR VOLTA</Text>
            <Text style={tw`text-white text-3xl font-bold`}>3:15:01</Text>
          </View>
          <View style={tw`bg-gray-800 p-4 rounded-lg w-[48%]`}>
            <Text style={tw`text-orange-500 text-lg`}>VOLTA ATUAL</Text>
            <Text style={tw`text-white text-3xl font-bold`}>2:10:01</Text>
          </View>
        </View>

        <RankingList runners={runners} />

        <View style={tw`mb-4`}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={[tw`w-full rounded-lg`, { height: height * 0.25 }]}
            initialRegion={{
              latitude: -34.397,
              longitude: 150.644,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          />
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