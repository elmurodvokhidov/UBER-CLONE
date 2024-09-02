import { icons } from '@/constants';
import { GoogleInputProps } from '@/types/type'
import { View, Text, Image } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const GoogleTextInput = ({
    icon,
    initialLocation,
    containerStyle,
    textInputBackgroundColor,
    handlePress
}: GoogleInputProps) => (
    <View className={`flex flex-row items-center justify-center relative z-50 rounded-xl mb-5 ${containerStyle}`}>
        <GooglePlacesAutocomplete
            fetchDetails={true}
            placeholder='Where do you want to go?'
            debounce={200}
            styles={{
                textInputContainer: {
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 20,
                    marginHorizontal: 20,
                    position: 'relative',
                    shadowColor: '#d4d4d4'
                },
                textInput: {
                    backgroundColor: textInputBackgroundColor || 'white',
                    fontSize: 16,
                    fontWeight: '600',
                    marginTop: 5,
                    width: '100%',
                    borderRadius: 200,
                },
                listView: {
                    backgroundColor: textInputBackgroundColor || 'white',
                    position: 'relative',
                    top: 0,
                    width: '100%',
                    borderRadius: 10,
                    shadowColor: '#d4d4d4',
                    zIndex: 99,
                },
            }}
            onPress={(data, details = null) => {
                handlePress({
                    latitude: details?.geometry.location.lat!,
                    longitude: details?.geometry.location.lng!,
                    address: data.description,
                });
            }}
            query={{
                key: googlePlacesApiKey,
                language: 'en',
            }}
            renderLeftButton={() => (
                <View className='justify-center items-center w-6 h-6'>
                    <Image
                        source={icon ? icon : icons.search}
                        className='w-6 h-6'
                        resizeMode='contain'
                    />
                </View>
            )}
            textInputProps={{
                placeholderTextColor: 'gray',
                placeholder: initialLocation ?? "Where do you want to go?",
            }}
        />
    </View>
)

export default GoogleTextInput