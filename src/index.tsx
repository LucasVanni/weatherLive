import React, { useState, useEffect } from 'react';
import {
  View, ActivityIndicator, StatusBar, Text,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import api from './services';

import getTemperature from './functions/getTemperature';

import styles from './styles';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [coordinates, setCoordinates] = useState({ latitude: -22.5, longitude: -48.71 });
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [temperature, setTemperature] = useState(0);

  useEffect(() => {
    Geolocation.getCurrentPosition(({ coords }) => {
      setCoordinates(coords);

      getTemperature({ latitude, longitude }).then((temp) => {
        setTemperature(temp);
      });
      setLoading(false);
      setLatitude(coords.latitude);
      setLongitude(coords.longitude);
    }, (error) => { console.log(error); },
    { enableHighAccuracy: false });
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
            api.get(`onecall?lat=${position.nativeEvent.coordinate.latitude}&lon=${position.nativeEvent.coordinate.longitude}&units=metric&appid=51a72be711c3639bf03cefb8e080dadd`)
              .then((response) => {
                const { data: { current: { temp } } } = response;
                setTemperature(temp);
              });
          }}
          style={styles.map}
        >
          <Marker
            pinColor="#7159c1"
            identifier="OriginMarker"
            coordinate={{
              latitude,
              longitude,
            }}
          >
            <Callout
              onPress={async () => {
                const temp = await getTemperature({
                  latitude, longitude,
                });

                setTemperature(temp);
              }}
            >
              <>
                <Text>
                  {temperature}
                  ºC
                </Text>
                <Text>Toque aqui para atualizar</Text>
              </>
            </Callout>
          </Marker>
        </MapView>
      )}
    </View>
  );
};

export default App;
