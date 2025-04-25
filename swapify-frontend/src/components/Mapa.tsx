import React from "react";
import { View, StyleSheet } from "react-native";
import MapView from "react-native-maps";

export default function Mapa() {
    const [origin, setOrigin] = React.useState({
        latitude: 38.341313,
        longitude: -0.538899,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    });
    return(
        <View style={styles.container}>
            <MapView 
                style={styles.map}
                initialRegion={{
                    latitude: origin.latitude,
                    longitude: origin.longitude,
                    latitudeDelta: origin.latitudeDelta,
                    longitudeDelta: origin.longitudeDelta
                }}
            />
        </View>
    );
}

// Añade esto al final del archivo
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        width: '100%',
        height: '100%'
    }
});