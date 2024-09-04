import { useStripe } from '@stripe/stripe-react-native';
import CustomButton from './CustomButton'
import { useState } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import { fetchAPI } from '@/lib/fetch';
import { PaymentProps } from '@/types/type';
import { useLocationStore } from '@/store';
import { useAuth } from '@clerk/clerk-expo';
import ReactNativeModal from 'react-native-modal';
import { images } from '@/constants';
import { router } from 'expo-router';

const Payment = ({
    fullName,
    email,
    amount,
    driverId,
    rideTime,
}: PaymentProps) => {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [success, setSuccess] = useState(false);
    const { userId } = useAuth();
    const {
        userAddress,
        userLatitude,
        userLongitude,
        destinationAddress,
        destinationLatitude,
        destinationLongitude
    } = useLocationStore();

    const initializePaymentSheet = async () => {
        const { error } = await initPaymentSheet({
            merchantDisplayName: "Ryde Inc.",
            intentConfiguration: {
                mode: {
                    amount: parseInt(amount) * 100,
                    currencyCode: "USD",
                },
                confirmHandler: async (paymentMethod, _, intentCreationCallback) => {
                    const { paymentIntent, customer } = await fetchAPI('/(api)/(stripe)/create', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: fullName || email.split('@')[0],
                            email: email,
                            amount: amount,
                            paymentMethodId: paymentMethod.id,
                        })
                    });

                    if (paymentIntent.client_secret) {
                        const { result } = await fetchAPI('/(api)/(stripe)/pay', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                payment_method_id: paymentMethod.id,
                                payment_intent_id: paymentIntent.id,
                                customer_id: customer
                            })
                        });

                        if (result.client_secret) {
                            await fetchAPI('/(api)/ride/create', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    origin_address: userAddress,
                                    destination_address: destinationAddress,
                                    origin_latitude: userLatitude,
                                    origin_longitude: userLongitude,
                                    destination_latitude: destinationLatitude,
                                    destination_longitude: destinationLongitude,
                                    ride_time: rideTime.toFixed(0),
                                    fare_price: parseInt(amount) * 100,
                                    payment_status: 'paid',
                                    driver_id: driverId,
                                    user_id: userId,
                                }),
                            });

                            intentCreationCallback({ clientSecret: result.client_secret });
                        }
                    }
                }
            },
            returnURL: 'myapp"//book-ride',
        });
        if (error) {
            console.log(error);
        }
    };

    const openPaymentSheet = async () => {
        await initializePaymentSheet();
        const { error } = await presentPaymentSheet();
        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            setSuccess(true);
        }
    };

    return (
        <>
            <CustomButton
                title='Confirm Ride'
                className='my-10'
                onPress={openPaymentSheet}
            />

            <ReactNativeModal
                isVisible={success}
                onBackdropPress={() => setSuccess(false)}
            >
                <View className='flex flex-col items-center justify-center bg-white p-7 rounded-2xl'>
                    <Image
                        source={images.check}
                        className='w-28 h-28 mt-5'
                    />
                    <Text className='text-2xl text-center font-JakartaBold mt-5'>
                        Booking placed successfully!
                    </Text>

                    <Text className='text-md text-general-200 font-JakartaMedium text-center mt-3'>
                        Thank you for your booking. Your reservation has been placed. Please proceed with your trip!
                    </Text>

                    <CustomButton
                        title='Back Home'
                        onPress={() => {
                            setSuccess(false);
                            router.push('/(root)/(tabs)/home')
                        }}
                        className='mt-5'
                    />
                </View>
            </ReactNativeModal>
        </>
    )
}

export default Payment