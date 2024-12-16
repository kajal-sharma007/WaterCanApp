import {createStackNavigator} from '@react-navigation/stack';
import Splash from '../Screens/Onboarding/Splash';
import Onboarding from '../Screens/Onboarding/Onboarding';
import ConnectWithPhone from '../Screens/Auth/ConnectWithPhone';
import ConnectWithEmail from '../Screens/Auth/ConnectWithEmail';
import TabNav from './TabNav';
import Home from '../Screens/Dashboard/Home';
import Route from '../Screens/Dashboard/Route';
import AddCustomer from '../Screens/Dashboard/AddCustomer';
import Profile from '../Screens/Dashboard/Profile';
import RouteDetails from '../Screens/Dashboard/RouteDetails';


const Stack = createStackNavigator();

const RootNav = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="ConnectWithPhone" component={ConnectWithPhone} />
      <Stack.Screen name="ConnectWithEmail" component={ConnectWithEmail} />
      <Stack.Screen name="TabNav" component={TabNav} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Route" component={Route} />
      <Stack.Screen name="AddCustomer" component={AddCustomer} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="RouteDetails" component={RouteDetails} />
    </Stack.Navigator>
  );
};

export default RootNav;
