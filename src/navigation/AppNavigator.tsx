import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from '../constants';

import {HomeScreen} from '../screens/HomeScreen';
import {AddRequestScreen} from '../screens/AddRequestScreen';
import {RequestDetailsScreen} from '../screens/RequestDetailsScreen';
// import ProfileScreen from '../screens/ProfileScreen';
// import AuthScreen from '../screens/AuthScreen';

export type RootStackParamList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.ADD_REQUEST]: undefined;
  [ROUTES.REQUEST_DETAILS]: {requestId: string};
  [ROUTES.PROFILE]: undefined;
  [ROUTES.AUTH]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={ROUTES.HOME}
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
          name={ROUTES.HOME}
          component={HomeScreen}
          options={{title: 'Заявки'}}
        />
        <Stack.Screen
          name={ROUTES.ADD_REQUEST}
          component={AddRequestScreen}
          options={{title: 'Новая заявка'}}
        />
        <Stack.Screen
          name={ROUTES.REQUEST_DETAILS}
          component={RequestDetailsScreen}
          options={{title: 'Детали заявки'}}
        />
        {/* <Stack.Screen
          name={ROUTES.PROFILE}
          component={ProfileScreen}
          options={{title: 'Профиль'}}
        />
        <Stack.Screen
          name={ROUTES.AUTH}
          component={AuthScreen}
          options={{title: 'Авторизация'}}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
