import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from './src/screens/HomeScreen';
import {AddRequestScreen} from './src/screens/AddRequestScreen';
import {RequestDetailsScreen} from './src/screens/RequestDetailsScreen';
import {RatingScreen} from './src/screens/RatingScreen';
import {initializeCategories} from './src/services/firebaseHelpers';
import {Alert, ActivityIndicator, View} from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        setIsLoading(true);
        await initializeCategories();
        setIsInitialized(true);
      } catch (error) {
        console.error('App initialization error:', error);
        Alert.alert(
          'Error',
          'Could not initialize the application. Please try again.',
          [
            {
              text: 'Retry',
              onPress: () => initApp(),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ],
        );
      } finally {
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  if (!isInitialized) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Requests'}}
        />
        <Stack.Screen
          name="AddRequest"
          component={AddRequestScreen}
          options={{title: 'New Request'}}
        />
        <Stack.Screen
          name="RequestDetails"
          component={RequestDetailsScreen}
          options={{title: 'Request Details'}}
        />
        <Stack.Screen
          name="Rating"
          component={RatingScreen}
          options={{title: 'Rate Provider'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
