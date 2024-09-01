import MapView, { PROVIDER_DEFAULT } from 'react-native-maps'

const Map = () => {
    // const region = {}

    return (
        <MapView
            provider={PROVIDER_DEFAULT}
            className='w-full h-full rounded-2xl'
            tintColor='black'
            mapType='mutedStandard'
            showsPointsOfInterest={false}
            // initialRegion={region}
            showsUserLocation={true}
            userInterfaceStyle='light'
        >
        </MapView>
    )
}

export default Map