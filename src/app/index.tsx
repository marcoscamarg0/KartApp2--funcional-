import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';
import tw from 'twrnc';

const { width, height } = Dimensions.get('window');

const RaceDashboard = () => {
  return (
    <View style={tw`flex-1 bg-black items-center justify-center p-4`}>
      <StatusBar barStyle="light-content" />
      <View style={[
        tw`w-full bg-gray-900 rounded-lg p-4`, 
        { width: width * 1, height: height * 1}
      ]}>
        <View style={tw`flex-row justify-between items-center mb-4`}>
          <TouchableOpacity>
            <FontAwesome name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <View style={tw`items-center`}>
            <Text style={tw`text-orange-500 text-3xl font-bold`}>25 KM/H</Text>
          </View>
        </View>

        <View style={tw`flex-row justify-between mb-4`}>
          <View style={tw`bg-gray-800 p-4 rounded-lg w-[48%]`}>
            <Text style={tw`text-orange-500 text-lg`}>MELHOR VOLTA</Text>
            <Text style={tw`text-white text-3xl font-bold`}>3:15:01</Text>
          </View>
          <View style={tw`bg-gray-800 p-4 rounded-lg w-[48%]`}>
            <Text style={tw`text-orange-500 text-lg`}>VOLTA 1</Text>
            <Text style={tw`text-white text-3xl font-bold`}>2:10:01</Text>
            <View style={tw`bg-white h-1 mt-2 rounded-full`}></View>
          </View>
        </View>

        <View style={tw`mb-4`}>
          <Text style={tw`text-orange-500 text-lg mb-2`}>RANKING</Text>
          <View style={tw`space-y-4`}>
            {['CORREDOR 1', 'CORREDOR 2', 'CORREDOR 3', 'CORREDOR 4', 'CORREDOR 5', 'CORREDOR 6'].map((runner, index) => (
              <View key={index} style={tw`flex-row justify-between items-center bg-gray-800 p-3 rounded-lg`}>
                <View style={tw`flex-row items-center`}>
                  <Text style={tw`text-white text-lg font-bold`}>{index + 1}º</Text>
                  <Text style={tw`ml-3 text-white text-lg`}>{runner}</Text>
                </View>
                <FontAwesome name="user" size={20} color="white" />
              </View>
            ))}
          </View>
        </View>

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
          <View style={tw`w-24 h-24 bg-gray-800 rounded-full items-center justify-center`}>
            <Text style={tw`text-white text-lg font-bold`}>VTR</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RaceDashboard;