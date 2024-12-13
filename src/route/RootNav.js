import {createStackNavigator} from '@react-navigation/stack';
import Splash from '../Screens/Onboarding/Splash';
import Onboarding from '../Screens/Onboarding/Onboarding';
import ConnectWithPhone from '../Screens/Auth/ConnectWithPhone';
import ConnectWithEmail from '../Screens/Auth/ConnectWithEmail';


const Stack = createStackNavigator();

const RootNav = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="ConnectWithPhone" component={ConnectWithPhone} />
      <Stack.Screen name="ConnectWithEmail" component={ConnectWithEmail} />
    </Stack.Navigator>
  );
};

export default RootNav;
