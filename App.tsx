import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/types/user';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { ProfileViewScreen } from './src/screens/ProfileViewScreen';
import { initUserDatabase } from './src/database/userDb';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    initUserDatabase().catch((err) => console.error('DB Init Error:', err));
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ProfileView" component={ProfileViewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}