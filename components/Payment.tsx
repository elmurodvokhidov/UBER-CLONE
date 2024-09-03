import { PaymentSheetError, useStripe } from '@stripe/stripe-react-native';
import CustomButton from './CustomButton'
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { fetchAPI } from '@/lib/fetch';
import { PaymentProps } from '@/types/type';

const Payment = ({
    fullName,
    email,
    amount,
    driverId,
    rideTime,
}: PaymentProps) => {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [success, setSuccess] = useState(false);

    const confirmHandler = async (paymentMethod, _, intentCreationCallback) => {
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
                // ride/create
            }
        }
    };

    const initializePaymentSheet = async () => {
        const { error } = await initPaymentSheet({
            merchantDisplayName: "Example, Inc.",
            intentConfiguration: {
                mode: {
                    amount: 1099,
                    currencyCode: "USD",
                },
                confirmHandler: confirmHandler
            }
        });
        if (error) {
            // error handler
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
        </>
    )
}

export default Payment