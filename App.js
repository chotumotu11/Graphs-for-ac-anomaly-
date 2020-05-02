import 'react-native-gesture-handler';
import React from 'react'
import { Button, View , StyleSheet, Image, ActivityIndicator, Text} from 'react-native'
import { NavigationContainer  } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {AsyncStorage} from 'react-native';
import tabber from './tab';
import Smart from './Smart.png'
import moment from 'moment';
import RNRestart from 'react-native-restart';



const Stack = createStackNavigator();


class startapp extends React.PureComponent {
    
    constructor(){
        super();
        this.state= {
            loading: true,
            date: '2020-03-20'
        };

        this.updatedb = this.updatedb.bind(this);
    }


    updatedb(startofmonth,date){
        let uri = 'http://118.185.27.157:5000/energygrid1?max_results=30000&where=_created>="'+startofmonth+'" and _created<="'+date+'"'

        fetch(uri)
            .then(response => response.json())
                .then((items) => {
                    items = items["_items"];   
                    let i =0;
                    let mymap = new Map();
                    for(let j=1;j<=31;j++){
                        mymap.set(j,[]);
                    }
                    
                    while(i<items.length){
                        let key = parseInt(moment.utc(items[i]["Time_Stamp"]).format("D"));
                        mymap.set(key,[...mymap.get(key),items[i]]);
                        i++;
                    }
                    for(let j=1;j<=parseInt(moment.utc(items[items.length-1]["Time_Stamp"]).format("D"));j++){
                        AsyncStorage.setItem(j+moment.utc(date).format("MMYYYY"),JSON.stringify(mymap.get(j)));
                    }
                    this.setState({loading: false});
                }).catch(err=>{
                    console.log("Server crashed  "+err);
                    //RNRestart.Restart();
                    this.setState({loading: false});
                });
    }

    componentDidMount(){
        let DATE_RFC1128 = "ddd, DD MMM YYYY HH:mm:ss [GMT]"
        let date  = moment.utc().format(DATE_RFC1128);
        let startofmonth = moment.utc().startOf('month').format(DATE_RFC1128);
        
        AsyncStorage.getItem("latestdate",(err,items)=>{
            this.updatedb(startofmonth,date);
        })
        AsyncStorage.setItem("latestdate",JSON.stringify(date));
    }
    
    render() {
        
        if(this.state.loading == true){
        return(
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignContent: 'center'}}>
                <Image style={{height: 200, width: 200, alignSelf: 'center'}} source={Smart}/>
                <ActivityIndicator size={"large"} style={styles.spinner} animating={this.state.fetching}/>
                <Text style={{textAlign: 'center'}}>Loading.... Data</Text>
            </View>
            )
        }
        
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


const styles = StyleSheet.create({
    spinner: {
    }
});

export default startapp