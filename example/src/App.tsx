import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Home';
import { Checkout } from 'react-native-arca-pg';

const Stackx = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stackx.Navigator initialRouteName="Home">
        <Stackx.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stackx.Screen
          name="Checkout"
          component={Checkout}
          options={{ headerShown: false }}
        />
      </Stackx.Navigator>
    </NavigationContainer>
  );
}
