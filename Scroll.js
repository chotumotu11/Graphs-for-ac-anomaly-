import React from 'react'
import { View, Text, ScrollView , StyleSheet, Button, Dimensions, ActivityIndicator} from 'react-native'
import BarChartComp from './barchart';
import moment from 'moment'



class DataScrollerDaily extends React.PureComponent {

    constructor(){
        super();
        this.state={
            daily_power: [],
            daily_temp: [],
            daily_humidity: [],
            date: "2020-02-18", // When the actual server is running set this to todays date. RO we could query the server to know the latest date.
            fetching: false,
        };

        this.myupdater = this.myupdater.bind(this);
        this.onLeftButtonClick = this.onLeftButtonClick.bind(this);
        this.onRightButtonClick = this.onRightButtonClick.bind(this);
    }


    myupdater(items, newDate){
        //console.log(moment.utc(items[items.length-1]["Time_Stamp"]).format("HH"));
        let tempmapvalue = new Map();
        let tempmapnum = new Map();
        let humimapvalue = new Map();
        let humimapnum = new Map();
        let powermapvalue = new Map();
        let powermapnum = new Map();

        let daily_power = [];
        let daily_temp = [];
        let daily_humidity = [];


        for(let i=0;i<24;i++){
            tempmapvalue.set(i,0);
            tempmapnum.set(i,0);
            humimapvalue.set(i,0);
            humimapnum.set(i,0);
            powermapvalue.set(i,0);
            powermapnum.set(i,0);
        }
        let i=0;
        while(i<items.length){
            let hour = parseInt(moment.utc(items[i]["Time_Stamp"]).format("H"));
            let temp = items[i]["room_temp"];
            let humidity = items[i]["Humidity"];
            let current = items[i]["Current"];
            let voltage = items[i]["voltage"];


            if(temp != 0){
                tempmapvalue.set(hour,tempmapvalue.get(hour)+temp);
                tempmapnum.set(hour,tempmapnum.get(hour)+1);
            }

            
            if(humidity != 0){
                humimapvalue.set(hour,humimapvalue.get(hour)+humidity);
                humimapnum.set(hour,humimapnum.get(hour)+1);
            }

            let pow = current*voltage;
            if(pow != 0){
                powermapvalue.set(hour,powermapvalue.get(hour)+pow);
                powermapnum.set(hour,powermapnum.get(hour)+1);
            }

            i++
        }

        for(let i=0;i<24;i++){

            let newTemp = tempmapvalue.get(i)/tempmapnum.get(i);
        
            if(isNaN(newTemp)){
                newTemp = 0;
            }
            daily_temp =  [...daily_temp, newTemp];

            let newPower = powermapvalue.get(i)/powermapnum.get(i);
            if(isNaN(newPower)){
                newPower = 0;
            }
            daily_power =  [...daily_power, newPower];

            let newHumidity = humimapvalue.get(i)/humimapnum.get(i);
            if(isNaN(newHumidity)){
                newHumidity = 0;
            }
            daily_humidity =  [...daily_humidity, newHumidity];

        }

        this.setState({
            daily_temp: daily_temp,
            daily_humidity: daily_humidity,
            daily_power: daily_power,
            date: newDate,
            fetching: false,
        });
    }

    componentDidMount(){
        this.setState({fetching: true});
        let weeklyuri = "https://smartbuilding.herokuapp.com/energygrid/currentDay?date1=";
        let date = this.state.date;
        fetch(weeklyuri+date)
            .then(response => response.json())
            .then((items)=>{
                this.myupdater(items,this.state.date);
            })
            .catch(err => console.log(err));
    }

    onLeftButtonClick(){
        let newDate = moment.utc(this.state.date).subtract(1,'days').format("YYYY-MM-DD");
        console.log("New Date when left button clicked "+newDate);
        this.setState({fetching: true});
        let dailyuri = "https://smartbuilding.herokuapp.com/energygrid/currentDay?date1=";
        fetch(dailyuri+newDate)
            .then(response => response.json())
            .then((items)=>{
                this.myupdater(items,newDate);
            })
            .catch(err => console.log(err));
    }


    onRightButtonClick(){
        let newDate = moment.utc(this.state.date).add(1,'days').format("YYYY-MM-DD");
        if(moment(newDate).isAfter("2020-02-18")){
            newDate = "2020-02-18";
        }
        console.log("New Date when right button clicked "+newDate);
        this.setState({fetching: true});
        let weeklyuri = "https://smartbuilding.herokuapp.com/energygrid/currentDay?date1=";
        fetch(weeklyuri+newDate)
            .then(response => response.json())
            .then((items)=>{
                this.myupdater(items,newDate);
            })
            .catch(err => console.log(err));
    }


    render() {

        return (
            <View >
                <ScrollView>
                    <ActivityIndicator size={"large"} style={styles.spinner} animating={this.state.fetching}/>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}> 
                            <Button title="Pevious Day" onPress={() => {this.onLeftButtonClick()}}/>
                            <Button title="Next Day" onPress={() => {this.onRightButtonClick()}}/>
                    </View>
                    <BarChartComp data={this.state.daily_temp} type={"Room Temperature"} numtype={0} weekly={false} date={moment.utc(this.state.date)}></BarChartComp>
                    <BarChartComp data={this.state.daily_humidity} type={"Room Humidity"} numtype={1} weekly={false} date={moment.utc(this.state.date)}></BarChartComp>
                    <BarChartComp data={this.state.daily_power} type={"Power"} numtype={2} weekly={false} date={moment.utc(this.state.date)} ></BarChartComp>
                </ScrollView>
            </View>
        )
    }

}


const styles = StyleSheet.create({
    spinner: {
        position: 'absolute',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    }
});

export default DataScrollerDaily