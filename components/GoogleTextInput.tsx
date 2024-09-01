import { GoogleInputProps } from '@/types/type'
import { View, Text } from 'react-native'

const GoogleTextInput = ({
    icon,
    initialLocation,
    containerStyle,
    textInputBackgroundColor,
    handlePress
}: GoogleInputProps) => (
    <View className={`flex flex-row items-center justify-center relative z-50 rounded-xl mb-5 ${containerStyle}`}>
        <Text>Search</Text>
    </View>
)

export default GoogleTextInput