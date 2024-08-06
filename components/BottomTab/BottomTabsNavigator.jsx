import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen, AddChatScreen, ChatScreen, VideoScreen } from '../../screens';
import { TamaguiProvider, Text, useTheme } from 'tamagui';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import tw from '../../lib/tailwind';



const Tab = createBottomTabNavigator();

function BottomTabsNavigator() {

    const theme = useTheme();


  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabel: ({ focused }) => {
          const color = focused ? 'white' : 'gray';
          // return <Text color={color} style={tw`text-xs font-medium`}>{route.name}</Text>;
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'AddChat') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          }

          return <Ionicons name={iconName} size={19} color={color} style={tw``} />;
        },
        tabBarStyle: {
            // TODO : fix theme color access
          backgroundColor: "#381fd1",
          borderTopWidth: 1,
          borderTopColor: '#ddd',
          paddingVertical: 9
        },
        tabBarActiveTintColor: 'white',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AddChat" component={AddChatScreen} />
    </Tab.Navigator>
  );
}

export default BottomTabsNavigator;
