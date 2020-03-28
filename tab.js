import 'react-native-gesture-handler';
import React from 'react'
import { Button } from 'react-native'
import DataScrollerDaily from './Scroll.js';
import { NavigationContainer  } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import DataScrollerWeek from './ScrollWeek.js';
import DataScrollerMonth from './ScrollMonth.js';


const Tab = createBottomTabNavigator();

class tabber extends React.PureComponent {

    render() {

        const daily_current = [
            [{date: '2020-02-11T08:31:37.592965+00:00', score: 0.26 },{date: '2020-02-11T09:31:40.025523+00:00', score: 7.03 } , { date: '2020-02-11T10:31:52.563578+00:00', score: 0.27}, { date: '2020-02-11T11:32:05.074452+00:00', score: 0.25} , { date: '2020-02-11T12:32:17.477089+00:00', score: 0.15 } , { date: '2020-02-11T13:30:29.469555+00:00', score: 0.18 } , { date: '2020-02-11T14:32:42.382256+00:00', score: 0.17 } , { date: '2020-02-11T15:30:54.360761+00:00', score: 0.15 } , { date: '2020-02-11T16:33:07.215934+00:00', score: 0.16 } , { date: '2020-02-11T17:29:18.820365+00:00', score: 0.16 } , {date: '2020-02-11T18:29:31.220549+00:00', score: 0.15} , { date: '2020-02-11T19:29:43.617822+00:00', score: 0.18} , { date: '2020-02-11T20:29:56.225259+00:00' , score: 0.18} , { date: '2020-02-11T21:30:08.440354+00:00' , score: 0.16}  , { date: '2020-02-11T22:32:21.281969+00:00' , score: 0.16} , { date: '2020-02-11T23:30:33.287112+00:00' , score: 0.18}]
        ];
        
        const daily_voltage =  [
            [{date: '2020-02-11T08:31:37.592965+00:00', score: 237.61 },{date: '2020-02-11T09:31:40.025523+00:00', score: 236.36 }, { date: '2020-02-11T10:31:52.563578+00:00', score: 241.73}, { date: '2020-02-11T11:32:05.074452+00:00', score: 239.59 } , { date: '2020-02-11T12:32:17.477089+00:00', score: 243.68} , { date: '2020-02-11T13:30:29.469555+00:00', score: 239.85 } , { date: '2020-02-11T14:32:42.382256+00:00', score: 241.89 } , { date: '2020-02-11T15:30:54.360761+00:00', score: 240.66 } , { date: '2020-02-11T16:33:07.215934+00:00', score: 242.62} , { date: '2020-02-11T17:29:18.820365+00:00', score: 242.44 } , {date: '2020-02-11T18:29:31.220549+00:00', score: 242.64} , { date: '2020-02-11T19:29:43.617822+00:00', score: 241.27} , { date: '2020-02-11T20:29:56.225259+00:00' , score: 242.86} , { date: '2020-02-11T21:30:08.440354+00:00' , score: 240.32} , { date: '2020-02-11T22:32:21.281969+00:00' , score: 243.97} ,  { date: '2020-02-11T23:30:33.287112+00:00' , score: 241.35} ]
        ];
        
        const daily_temp =[
            [{date: '2020-02-11T08:31:37.592965+00:00', score: 26.4},{date: '2020-02-11T09:31:40.025523+00:00', score: 25.83 }, { date: '2020-02-11T10:31:52.563578+00:00', score: 26.12}, { date: '2020-02-11T11:32:05.074452+00:00', score: 27.04 }, { date: '2020-02-11T12:32:17.477089+00:00', score: 27.31 } , { date: '2020-02-11T13:30:29.469555+00:00', score: 27.41 } , { date: '2020-02-11T14:32:42.382256+00:00', score: 27.47 } , { date: '2020-02-11T15:30:54.360761+00:00', score: 27.49 } , { date: '2020-02-11T16:33:07.215934+00:00', score: 27.49 } , { date: '2020-02-11T17:29:18.820365+00:00', score: 27.5 } , {date: '2020-02-11T18:29:31.220549+00:00', score: 27.7 } , { date: '2020-02-11T19:29:43.617822+00:00', score: 27.72} , { date: '2020-02-11T20:29:56.225259+00:00' , score: 27.74} , { date: '2020-02-11T21:30:08.440354+00:00' , score: 27.75 } , { date: '2020-02-11T22:32:21.281969+00:00' , score: 27.78} ,  { date: '2020-02-11T23:30:33.287112+00:00' , score: 27.8}]
        ];
        
        const daily_humidity = [
            [{date: '2020-02-11T08:31:37.592965+00:00', score: 56.12},{date: '2020-02-11T09:31:40.025523+00:00', score: 51.36 }, { date: '2020-02-11T10:31:52.563578+00:00', score: 55.03},{ date: '2020-02-11T11:32:05.074452+00:00', score: 57.6 } , { date: '2020-02-11T12:32:17.477089+00:00', score: 56.33 } , { date: '2020-02-11T13:30:29.469555+00:00', score: 56.42 } , { date: '2020-02-11T14:32:42.382256+00:00', score: 56.62 } , { date: '2020-02-11T15:30:54.360761+00:00', score: 56.83 } , { date: '2020-02-11T16:33:07.215934+00:00', score: 56.83 } , { date: '2020-02-11T17:29:18.820365+00:00', score: 56.86} , {date: '2020-02-11T18:29:31.220549+00:00', score: 57.66} , { date: '2020-02-11T19:29:43.617822+00:00', score: 58.09} ,  { date: '2020-02-11T20:29:56.225259+00:00' , score: 58.15} , { date: '2020-02-11T21:30:08.440354+00:00' , score: 58.02} , { date: '2020-02-11T22:32:21.281969+00:00' , score: 58.66} ,  { date: '2020-02-11T23:30:33.287112+00:00' , score: 58.83} ]
        ];
        


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