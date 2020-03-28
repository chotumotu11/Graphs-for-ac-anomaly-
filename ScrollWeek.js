import React from 'react'
import { View, ScrollView , StyleSheet, ActivityIndicator, Dimensions, Button} from 'react-native'
import MinMaxChartCustom from './minmaxchart'
import BarChartComp from './barchart'
import moment from 'moment'


class DataScrollerWeek extends React.PureComponent {


    constructor(){
        super();
        this.state = {
            weektempmax: [],
            weektempmin: [],
            weekhumimax: [],
            weekhumimin: [],
            weekpowersum: [],
            fetching: false,
            date: "2020-02-18", // Since we do not have a realtime server because of Covid-19 virus. This is the start date of the app. Else current date will be used. 
        };
        this.onLeftButtonClick = this.onLeftButtonClick.bind(this);
        this.onRightButtonClick = this.onRightButtonClick.bind(this);
        this.updater = this.myupdater.bind(this);
    }

    myupdater(items, newDate){
        let tempmapvaluemax = new Map();
        let tempmapvaluemin = new Map();
        let humimapvaluemax = new Map();
        let humimapvaluemin = new Map();
        let powermapvaluesum = new Map();
        //let powermapnum = new Map();

        let sum_power = [];
        let min_temp = [];
        let min_humidity = [];
        let max_temp = [];
        let max_humidity = [];


        let first = parseInt(moment.utc(items[0]["Time_Stamp"]).format("D"));
        let last = parseInt(moment.utc(items[items.length-1]["Time_Stamp"]).format("D"));
        for(let i=first;i<=last;i++){
            tempmapvaluemax.set(i,0);
            tempmapvaluemin.set(i,0);
            humimapvaluemax.set(i,0);
            humimapvaluemin.set(i,0);
            powermapvaluesum.set(i,0);
        }
        let i=0;
        while(i<items.length){
            let day = parseInt(moment.utc(items[i]["Time_Stamp"]).format("D"));
            let temp = items[i]["room_temp"];
            let humidity = items[i]["Humidity"];
            let current = items[i]["Current"];
            let voltage = items[i]["voltage"];


            if(temp != 0){
                if(temp>tempmapvaluemax.get(day)){
                    tempmapvaluemax.set(day,temp);
                }
                if(temp<tempmapvaluemin.get(day) || tempmapvaluemin.get(day)==0){
                    tempmapvaluemin.set(day,temp);
                }
            }

            if(humidity != 0){
                if(humidity>humimapvaluemax.get(day)){
                    humimapvaluemax.set(day,humidity);
                }
                if(humidity<humimapvaluemin.get(day) || humimapvaluemin.get(day)==0){
                    humimapvaluemin.set(day,humidity);
                }
            }

            let pow = current*voltage;
            if(pow != 0){
                powermapvaluesum.set(day,powermapvaluesum.get(day)+pow);
            }

            i++
        }

        for(let i=first;i<=last;i++){

            min_temp =  [...min_temp, tempmapvaluemin.get(i)];
            max_temp =  [...max_temp, tempmapvaluemax.get(i)];

            sum_power =  [...sum_power, powermapvaluesum.get(i)];

            min_humidity =  [...min_humidity, humimapvaluemin.get(i)];
            max_humidity =  [...max_humidity, humimapvaluemax.get(i)];
        }


        let place = last-first+1;
        // If a week has less than 7 days of data , then we pad with 0's else the Charts api won't work. 
        for(let i=place;i<7;i++){
            min_temp = [...min_temp,0];
            max_temp = [...max_temp,0];
            min_humidity = [...min_humidity,0];
            max_humidity = [...max_humidity,0];
            sum_power = [...sum_power,0];
        }

        console.log("Min Humidity : "+min_humidity);
        console.log("Max Humidity : "+max_humidity);
        console.log("Max Temperature : "+max_temp);
        console.log("Min Temperature : "+min_temp);
        console.log("Sum power : "+sum_power);


        this.setState({
            weektempmax: max_temp,
            weektempmin: min_temp,
            weekhumimax: max_humidity,
            weekhumimin: min_humidity,
            weekpowersum: sum_power,
            fetching: false,
            date: newDate,
        });
    }

    componentDidMount(){
        this.setState({fetching: true});
        let weeklyuri = "https://smartbuilding.herokuapp.com/energygrid/currentWeek?date1=";
        let date = this.state.date;
        fetch(weeklyuri+date)
            .then(response => response.json())
            .then((items)=>{
                this.myupdater(items,this.state.date);
            })
            .catch(err => console.log(err));
    }


    onLeftButtonClick(){
        let newDate = moment.utc(this.state.date).subtract(7,'days').endOf('week').format("YYYY-MM-DD");
        console.log("New Date when left button clicked "+newDate);
        this.setState({fetching: true});
        let weeklyuri = "https://smartbuilding.herokuapp.com/energygrid/currentWeek?date1=";
        fetch(weeklyuri+newDate)
            .then(response => response.json())
            .then((items)=>{
                this.myupdater(items,newDate);
            })
            .catch(err => console.log(err));
    }

    onRightButtonClick(){
        let newDate = moment.utc(this.state.date).add(7,'days').endOf('week').format("YYYY-MM-DD");
        if(moment(newDate).isAfter("2020-02-18")){
            newDate = "2020-02-18";
        }
        console.log("New Date when right button clicked "+newDate);
        this.setState({fetching: true});
        let weeklyuri = "https://smartbuilding.herokuapp.com/energygrid/currentWeek?date1=";
        fetch(weeklyuri+newDate)
            .then(response => response.json())
            .then((items)=>{
                this.myupdater(items,newDate);
            })
            .catch(err => console.log(err));
    }

    render() {

        const weektempmax = this.state.weektempmax;
        const weektempmin = this.state.weektempmin;
        const weekhumimax = this.state.weekhumimax;
        const weekhumimin = this.state.weekhumimin;
        const weekpowersum = this.state.weekpowersum;
        const date = moment.utc(this.state.date).endOf('week');

        const current = [];


        return (
            <View >
                <ScrollView>
                    <ActivityIndicator size={"large"} style={styles.spinner} animating={this.state.fetching}/>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}> 
                            <Button title="Pevious week" onPress={() => {this.onLeftButtonClick()}}/>
                            <Button title="Next week" onPress={() => {this.onRightButtonClick()}}/>
                        </View>
                        <MinMaxChartCustom max={weektempmax} min={weektempmin} date={date} type={"Room Temperature"} numtype={0}></MinMaxChartCustom>
                        <MinMaxChartCustom max={weekhumimax} min={weekhumimin} date={date} type={"Room Humidity"} numtype={1}></MinMaxChartCustom>
                        <BarChartComp data={weekpowersum} type={"Total power per day "} numtype={3} weekly={true} date={moment.utc(this.state.date).endOf('week')} ></BarChartComp>
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


export default DataScrollerWeek