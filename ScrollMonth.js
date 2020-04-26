import React from 'react'
import { View, ScrollView, ActivityIndicator, StyleSheet, Dimensions,  AsyncStorage, Button} from 'react-native'
import MonthChart from './monthchart';
import moment from 'moment'




class DataScrollerMonth extends React.PureComponent {



    constructor(){
        super();
        this.state={
            temp: [],
            temp_min: [],
            humidity_min: [],
            humidity: [],
            power: [],
            date: moment.utc(),
            fetching: false,
        };
        this.myupdater = this.myupdater.bind(this);
        this.onLeftButtonClick = this.onLeftButtonClick.bind(this);
        this.onRightButtonClick = this.onRightButtonClick.bind(this);
    }


    myupdater(items, newDate){
        let sum_power = [];
        let min_temp = [];
        let min_humidity = [];
        let max_temp = [];
        let max_humidity = [];

        let tempmapvaluemax = new Map();
        let tempmapvaluemin = new Map();
        let humimapvaluemax = new Map();
        let humimapvaluemin = new Map();
        let powermapvaluesum = new Map();

        first = parseInt(moment.utc(newDate).startOf('month').format("D"));
        last = parseInt(moment.utc(newDate).endOf('month').format("D"))

        console.log("First "+first);
        console.log("Second "+last);
        for(let i = first;i<=last;i++){
            tempmapvaluemax.set(i,0);
            tempmapvaluemin.set(i,0);
            humimapvaluemax.set(i,0);
            humimapvaluemin.set(i,0);
            powermapvaluesum.set(i,0);
        }

        let i=0;
        while(i<items.length){
            let day = parseInt(moment.utc(items[i]["_created"]).format("D"));
        
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


        this.setState({
            temp: max_temp,
            temp_min: min_temp,
            humidity_min : min_humidity,
            humidity: max_humidity,
            power: sum_power,
            date: newDate,
            fetching: false,
        });


    }


    componentDidMount(){
        this.setState({fetching: true});
        //this.getData();
        //this.intervalid = setInterval(() => this.getData(),120000);
        let keyarr =[];
        let newend = moment.utc();
        let monthstart = moment.utc().startOf('month');
        console.log(monthstart);
        while(monthstart.isSameOrBefore(newend)){
            keyarr = [...keyarr,monthstart.format('DMMYYYY')];
            monthstart.add(1, 'days')
        }

        AsyncStorage.multiGet(keyarr, (err, stores) => {
            let passdata = [];
            for(let i=0;i<stores.length;i++){
                if(stores[i][1]!=null){
                    passdata = [...passdata,...JSON.parse(stores[i][1])];
                }
            } 
            this.myupdater(passdata,newend);
            
          });
    }


    onLeftButtonClick(){
        let DATE_RFC1128 = "ddd, DD MMM YYYY HH:mm:ss [GMT]";
        let newDate = moment.utc(this.state.date).subtract(1,'month').endOf('month').format("YYYY-MM-DD");
        let firstload = 0;
        console.log("New Date when left button clicked "+newDate);
        this.setState({fetching: true});
        let monthswitch = 0;
        let startdate = moment.utc(newDate).startOf('month');
        let enddate = moment.utc(newDate).endOf('month');
        console.log("StartDate "+startdate.format("DMMYYYY"));
        let www;
        console.log("End date "+enddate.format("DMMYYYY")); 
            AsyncStorage.getItem(moment.utc(startdate).format("DMMYYYY")).then((item)=>{
                if(item == null){
                    firstload=1;
                    console.log("Start of month "+startdate.format("DDMMYYYY"));
                    console.log("End of month "+enddate.format("DDMMYYYY"));
                    let uri = 'http://118.185.27.157:5000/energygrid1?max_results=30000&where=_created>="'+startdate.startOf('month').format(DATE_RFC1128)+'" and _created<="'+startdate.endOf('month').format(DATE_RFC1128)+'"';
                    console.log(uri);
                    fetch(uri)
                    .then(response => response.json())
                        .then((items) => {
                            items = items["_items"];
                        
                            let i =0;
                            let mymap = new Map();
                            for(let j=1;j<=31;j++){
                                mymap.set(j,[]);
                            }
                            console.log("The length is "+items.length);
                            while(i<items.length){
                                let key = parseInt(moment.utc(items[i]["_created"]).format("D"));
                                mymap.set(key,[...mymap.get(key),items[i]]);
                                i++;
                            }
                            for(let j=1;j<=parseInt(moment.utc(items[items.length-1]["_created"]).format("D"));j++){
                                AsyncStorage.setItem(j+startdate.format("MMYYYY"),JSON.stringify(mymap.get(j)));
                            }  

                            this.myupdater(items,newDate);
                            
                            
                        }).catch(err=>{
                            console.log("Server crashed  "+err);
                            //RNRestart.Restart();
        
                        });


                }else{
                    let keyarr =[];
                    while(startdate.isSameOrBefore(enddate)){
                        keyarr = [...keyarr,startdate.format('DMMYYYY')];
                        startdate.add(1, 'days')
                    }
        
                    AsyncStorage.multiGet(keyarr, (err, stores) => {
                        let passdata = [];
                        for(let i=0;i<stores.length;i++){
                            if(stores[i][1]!=null){
                                passdata = [...passdata,...JSON.parse(stores[i][1])];
                            }
                        } 
                        this.myupdater(passdata,newDate);
            
                    } );
                }
            })
          
    }

    onRightButtonClick(){
        let DATE_RFC1128 = "ddd, DD MMM YYYY HH:mm:ss [GMT]";
        let newDate = moment.utc(this.state.date).add(1,'month').endOf('month').format("YYYY-MM-DD");
        if(moment.utc(newDate).isAfter(moment.utc())){
            newDate =  moment.utc().format("YYYY-MM-DD");
        }
        console.log("New Date when right button clicked "+newDate);
        this.setState({fetching: true});
        let dateforpassing = moment.utc(newDate).startOf('month');
        let startdate = moment.utc(newDate).startOf('month');
        let enddate = moment.utc(newDate).endOf('month');
        console.log("StartDate "+startdate.format("DMMYYYY"));
        console.log("End date "+enddate.format("DMMYYYY")); 


        let keyarr =[];
        while(startdate.isSameOrBefore(enddate)){
            keyarr = [...keyarr,startdate.format('DMMYYYY')];
            startdate.add(1, 'days')
        }
        //console.log("The keys are "+keyarr);

        AsyncStorage.multiGet(keyarr, (err, stores) => {
            let passdata = [];
            for(let i=0;i<stores.length;i++){
                if(stores[i][1]!=null){
                    passdata = [...passdata,...JSON.parse(stores[i][1])];
                }
            } 
            //console.log("The passed data is "+passdata);
            this.myupdater(passdata,dateforpassing);
            
          });

        /*
        let weeklyuri = "https://smartbuilding.herokuapp.com/energygrid/currentWeek?date1=";
        fetch(weeklyuri+newDate)
            .then(response => response.json())
            .then((items)=>{
                this.myupdater(items,newDate,0);
            })
            .catch(err => console.log(err));
        */
    }


    render() {
        return (
            <View>
                <ScrollView>
                    <ActivityIndicator size={"large"} style={styles.spinner} animating={this.state.fetching}/>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}> 
                            <Button title="Pevious Month" onPress={() => {this.onLeftButtonClick()}}/>
                            <Button title="Next Month" onPress={() => {this.onRightButtonClick()}}/>
                    </View>
                    <MonthChart temp_min = {this.state.temp_min} humidity_min = {this.state.humidity_min}  power={this.state.power} humidity={this.state.humidity} temp={this.state.temp} date={this.state.date} ></MonthChart>
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

export default DataScrollerMonth