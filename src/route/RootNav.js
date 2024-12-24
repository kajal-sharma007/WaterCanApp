import {createStackNavigator} from '@react-navigation/stack';
import Splash from '../Screens/Onboarding/Splash';
import Onboarding from '../Screens/Onboarding/Onboarding';
import ConnectWithPhone from '../Screens/Auth/phone/ConnectWithPhone';
import ConnectWithEmail from '../Screens/Auth/email/ConnectWithEmail';
import TabNav from './TabNav';
import Home from '../Screens/Dashboard/Home/Home';
import Route from '../Screens/Dashboard/Route/Route';
import AddCustomer from '../Screens/Dashboard/AddCustomer/AddCustomer';
import Profile from '../Screens/Dashboard/Profile/Profile';
import RouteDetails from '../Screens/Dashboard/RouteDetails/RouteDetails';
import EditTransactionScreen from '../Screens/Dashboard/Transaction/EditTransactionScreen';



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
      <Stack.Screen
        name="EditTransactionScreen"
        component={EditTransactionScreen}
      />
    </Stack.Navigator>
  );
};

export default RootNav;
