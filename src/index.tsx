import React, { useState, useEffect } from 'react';
import {
  View, StyleSheet, ActivityIndicator, StatusBar, Text,
} from 'react-native';
// import DatePicker from 'react-native-date-picker';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import api from './services';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#7159c1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default () => {
  const [loading, setLoading] = useState(true);
  const [coordinates, setCoordinates] = useState({ latitude: -22.5, longitude: -48.71 });
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [temperature, setTemperature] = useState(0);

  useEffect(() => {
    Geolocation.getCurrentPosition(({ coords }) => {
      setCoordinates(coords);

      setLatitude(coords.latitude);
      setLongitude(coords.longitude);

      api.get(`onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=51a72be711c3639bf03cefb8e080dadd`).then((response) => {
        const { data: { current: { temp } } } = response;
        setTemperature(temp);
        setLoading(false);
      });
    });
  }, [latitude, longitude]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <MapView
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            latitudeDelta: 0.0068,
            longitudeDelta: 0.0068,
          }}
          onUserLocationChange={(position) => {
            setLatitude(position.nativeEvent.coordinate.latitude);
            setLongitude(position.nativeEvent.coordinate.longitude);
          }}
          followsUserLocation
          style={styles.map}
        >
          <>
            <Marker
              pinColor="#7159c1"
              identifier="OriginMarker"
              coordinate={{
                latitude,
                longitude,
              }}
            >
              <Callout>
                <Text>
                  {temperature}
                </Text>
              </Callout>
            </Marker>

          </>
        </MapView>
      )}
    </View>
  );
};
