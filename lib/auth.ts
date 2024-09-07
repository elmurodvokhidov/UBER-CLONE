import * as SecureStore from 'expo-secure-store';
import * as Linking from 'expo-linking';
import { fetchAPI } from './fetch';

export const tokenCache = {
    async getToken(key: string) {
        try {
            const item = await SecureStore.getItemAsync(key)
            if (item) {
                console.log(`${key} was used 🔐 \n`)
            } else {
                console.log('No values stored under key: ' + key)
            }
            return item
        } catch (error) {
            console.error('SecureStore get item error: ', error)
            await SecureStore.deleteItemAsync(key)
            return null
        }
    },
    async saveToken(key: string, value: string) {
        try {
            return SecureStore.setItemAsync(key, value)
        } catch (err) {
            return
        }
    },
}

export const googleOAuth = async (startOAuthFlow: any) => {
    try {
        const { createdSessionId, signUp, setActive } = await startOAuthFlow({
            redirectUrl: Linking.createURL('/(root)/(tabs)/home', { scheme: 'myapp' }),
        })

        if (createdSessionId) {
            if (setActive) {
                setActive({ session: createdSessionId });

                if (signUp.createdUserId) {
                    await fetchAPI('/(api)/user', {
                        method: 'POST',
                        body: JSON.stringify({
                            name: `${signUp.firstName} ${signUp.lastName}`,
                            email: signUp.emailAddress,
                            clerkId: signUp.createdUserId,
                        }),
                    });
                }

                return {
                    success: true,
                    code: 'success',
                    message: 'You have successfully authenticated.',
                }
            }
        }

        return {
            success: false,
            code: 'success',
            message: 'An error occurred.',
        }
    } catch (error: any) {
        console.log(error);

        return {
            success: false,
            code: error.code,
            message: error?.errors[0]?.longMessage,
        }
    }
}