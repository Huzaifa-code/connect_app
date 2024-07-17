import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RegisterScreen, LoginScreen ,HomeScreen , AddChatScreen, ChatScreen, VideoScreen} from './screens';
import { UserProvider } from './context/UserContext';
import { PermissionsAndroid, Platform } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useEffect } from 'react';
import DrawerMenu from './components/DrawerMenu/DrawerMenu';
import { TamaguiProvider } from 'tamagui'
import { tamaguiConfig } from './tamagui.config'

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: "#381fd1" },
  headerTitleStyle: {color: "white"},
  headerTintColor: "white",
};

const DrawerNavigator = () => (
  <Drawer.Navigator drawerContent={props => <DrawerMenu {...props} />}>
    <Drawer.Screen name='Home' component={HomeScreen} />
    <Drawer.Screen name='AddChat' component={AddChatScreen} />
    <Drawer.Screen name='Chat' component={ChatScreen} />
    <Drawer.Screen name='Video' component={VideoScreen} />
  </Drawer.Navigator>
);


export default function App() {

  useEffect(() => {
    const run = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          'android.permission.POST_NOTIFICATIONS',
          'android.permission.BLUETOOTH_CONNECT',
        ]);
      }
    };
    run();
  }, []);


  return (
    <UserProvider>
      <TamaguiProvider config={tamaguiConfig}  >
      <NavigationContainer>
          <Stack.Navigator 
            // initialRouteName='Home'
            screenOptions={globalScreenOptions}
            >
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='Register' component={RegisterScreen} />
            <Stack.Screen name='Main' component={DrawerNavigator} options={{ headerShown: false }} />
          </Stack.Navigator>
      </NavigationContainer>
      </TamaguiProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
