import 'react-native-gesture-handler';
import React from 'react'
import { Text, Platform } from 'react-native'
import NetInfo  from "@react-native-community/netinfo"
import DataScrollerDaily from './Scroll.js';
import { NavigationContainer  } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import DataScrollerWeek from './ScrollWeek.js';
import DataScrollerMonth from './ScrollMonth.js';


const Tab = createBottomTabNavigator();

class tabber extends React.PureComponent {

    constructor(){
        super();
        this.state ={
            internet: false
        };
    }

    componentDidMount(){
        NetInfo.fetch().then(state => {
            if(state.isInternetReachable){
                this.setState({
                    internet: true
                });
            }
          });
    }

    render() {

        if(this.state.internet == false){
            return(
                <Text>
                    Please restart the app after turning on the internet.
                </Text>
            )
        }

        return (
            <Tab.Navigator>
                <Tab.Screen name="Daily" component={DataScrollerDaily}  />
                <Tab.Screen name="Weekly" component={DataScrollerWeek}  />
                <Tab.Screen name="Monthly" component={DataScrollerMonth}  />
            </Tab.Navigator>
        )
    }

}

export default tabber