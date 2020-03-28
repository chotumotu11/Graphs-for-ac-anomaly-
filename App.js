import 'react-native-gesture-handler';
import React from 'react'
import { Button } from 'react-native'
import { NavigationContainer  } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import tabber from './tab';


const Stack = createStackNavigator();


class startapp extends React.PureComponent {

    render() {
        return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Main" component={tabber}   
                    options={{ title: 'Smart Building',
                                headerStyle: {
                                backgroundColor: 'white',
                            },
                            headerTintColor: '#000',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                            },
        }} />
            </Stack.Navigator>
        </NavigationContainer>
        )
    }

}

export default startapp