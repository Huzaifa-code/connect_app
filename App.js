import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RegisterScreen, LoginScreen ,HomeScreen , AddChatScreen, ChatScreen, VideoScreen} from './screens';
import { UserProvider } from './context/UserContext';
import { PermissionsAndroid, Platform } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useEffect } from 'react';
import { TamaguiProvider, Theme } from 'tamagui'
import { tamaguiConfig } from './tamagui.config'
import { BottomTabsNavigator,DrawerMenu } from './components';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: "#381fd1" },
  headerTitleStyle: {color: "white"},
  headerTintColor: "white",
};

const DrawerNavigator = () => (
  <Drawer.Navigator drawerContent={props => <DrawerMenu {...props} />}>
    <Drawer.Screen name="All" component={BottomTabsNavigator} options={{ headerShown: false }} />
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
        <Theme name="light">
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
        </Theme>
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
