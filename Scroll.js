import React from 'react'
import { View, Text, ScrollView , StyleSheet, Button, Dimensions, ActivityIndicator, AsyncStorage} from 'react-native'
import BarChartComp from './barchart';
import moment from 'moment'



class DataScrollerDaily extends React.PureComponent {

    intervalID = 0;

    constructor(){
        super();
        this.state={
            daily_power: [],
            daily_temp: [],
            daily_humidity: [],
            date: moment.utc(), // When the actual server is running set this to todays date. RO we could query the server to know the latest date.
            fetching: false,
        };

        this.myupdater = this.myupdater.bind(this);
        this.onLeftButtonClick = this.onLeftButtonClick.bind(this);
        this.onRightButtonClick = this.onRightButtonClick.bind(this);
        this.getDailyData = this.getDailyData.bind(this);
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
        console.log("Daily temp "+daily_temp);
        console.log("Daily Humidity "+daily_humidity);
        console.log("Daily power"+daily_power);

        this.setState({
            daily_temp: daily_temp,
            daily_humidity: daily_humidity,
            daily_power: daily_power,
            date: newDate,
            fetching: false,
        });
    }



    getDailyData(){
        console.log("Something 3");
        let latestweekstart = moment.utc().startOf('day');
        let latestweekend = moment.utc().endOf('day');
        if(moment.utc(this.state.date).isSameOrAfter(latestweekstart) && moment.utc(this.state.date).isSameOrBefore(latestweekend)){
            console.log("Something 2");
            let DATE_RFC1128 = "ddd, DD MMM YYYY HH:mm:ss [GMT]";
            let start = moment.utc(this.state.date).startOf('day');
            let stop = moment.utc(this.state.date).endOf('date');
            let uri = 'http://118.185.27.157:5000/energygrid1?max_results=30000&where=_created>="'+start.format(DATE_RFC1128)+'" and _created<="'+stop.format(DATE_RFC1128)+'"';
            fetch(uri).then(response => response.json())
                .then(item => {
                    console.log("Something 1");
                    item = item["_items"];
                    AsyncStorage.setItem(start.format("DMMYYYY"),JSON.stringify(item));
                    let startweek = start.startOf('week');
                    let todaysdate = moment.utc().format("DMMYYYY")
                    AsyncStorage.setItem(todaysdate,JSON.stringify(item));
                    this.myupdater(item,this.state.date);
                })
        }
    }

    componentDidMount(){    
        this.setState({fetching: true,date: moment.utc()});
        this.getDailyData();
        this.intervalID = setInterval(() => this.getDailyData(),120000);
        let DATE_RFC1128 = "ddd, DD MMM YYYY HH:mm:ss [GMT]";
        let datetocheck = this.state.date;
        console.log("My data format "+datetocheck.format("DMMYYYY"));
        AsyncStorage.getItem(datetocheck.format("DMMYYYY"),(err,items)=>{
            //console.log("My items "+items);
            if(items == null){

                let weeklyuri = 'http://118.185.27.157:5000/energygrid1?max_results=30000&where=_created>="'+datetocheck.startOf('day').format(DATE_RFC1128)+'" and _created<="'+datetocheck.endOf('day').format(DATE_RFC1128)+'"';
                console.log(weeklyuri);
                fetch(weeklyuri)
                    .then(response => response.json())
                    .then((items)=>{
                        this.myupdater(items["_items"],this.state.date);
                    })
                    .catch(err => console.log(err));
            }else{
                this.myupdater(JSON.parse(items),this.state.date);
            }
        })
    }

    componentWillUnmount(){
        clearInterval(this.intervalID);
    }

    onLeftButtonClick(){
        let newDate = moment.utc(this.state.date).subtract(1,'days');
        console.log("New Date when left button clicked "+newDate.format("DDMMYYYY"));
        this.setState({fetching: true});
        let DATE_RFC1128 = "ddd, DD MMM YYYY HH:mm:ss [GMT]";
        AsyncStorage.getItem(newDate.format("DMMYYYY"),(err,items)=>{
            //console.log("My items "+items);
            if(items == null){

                let weeklyuri = 'http://118.185.27.157:5000/energygrid1?max_results=30000&where=_created>="'+newDate.startOf('day').format(DATE_RFC1128)+'" and _created<="'+newDate.endOf('day').format(DATE_RFC1128)+'"';
                console.log(weeklyuri);
                fetch(weeklyuri)
                    .then(response => response.json())
                    .then((items)=>{
                        this.myupdater(items["_items"],newDate);
                    })
                    .catch(err => console.log(err));
            }else{
                this.myupdater(JSON.parse(items),newDate);
            }
        })

    }


    onRightButtonClick(){
        let newDate = moment.utc(this.state.date).add(1,'days');
        if(moment.utc(newDate).isAfter(moment.utc())){
            newDate =  moment.utc();
        }
        console.log("New Date when right button clicked "+newDate.format("DDMMYYYY"));
        this.setState({fetching: true});
        let DATE_RFC1128 = "ddd, DD MMM YYYY HH:mm:ss [GMT]";
        AsyncStorage.getItem(newDate.format("DMMYYYY"),(err,items)=>{
            //console.log("My items "+items);
            if(items == null){

                let weeklyuri = 'http://118.185.27.157:5000/energygrid1?max_results=30000&where=_created>="'+newDate.startOf('day').format(DATE_RFC1128)+'" and _created<="'+newDate.endOf('day').format(DATE_RFC1128)+'"';
                console.log(weeklyuri);
                fetch(weeklyuri)
                    .then(response => response.json())
                    .then((items)=>{
                        this.myupdater(items["_items"],newDate);
                    })
                    .catch(err => console.log(err));
            }else{
                this.myupdater(JSON.parse(items),newDate);
            }
        })
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
                    <BarChartComp data={this.state.daily_temp} type={"Room temperature per hour average"} numtype={0} weekly={false} date={moment.utc(this.state.date)}></BarChartComp>
                    <BarChartComp data={this.state.daily_humidity} type={"Room humidity per hour average"} numtype={1} weekly={false} date={moment.utc(this.state.date)}></BarChartComp>
                    <BarChartComp data={this.state.daily_power} type={"Power per hour average"} numtype={2} weekly={false} date={moment.utc(this.state.date)} ></BarChartComp>
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