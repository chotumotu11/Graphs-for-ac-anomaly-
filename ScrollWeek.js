import React from 'react'
import { View, ScrollView , StyleSheet, ActivityIndicator, Dimensions, Button, AsyncStorage} from 'react-native'
import MinMaxChartCustom from './minmaxchart'
import BarChartComp from './barchart'
import moment from 'moment'


class DataScrollerWeek extends React.PureComponent {

    intervalid = 0;

    constructor(){
        super();
        this.state = {
            weektempmax: [],
            weektempmin: [],
            weekhumimax: [],
            weekhumimin: [],
            weekpowersum: [],
            fetching: false,
            data: [],
            date: moment.utc(), // Since we do not have a realtime server because of Covid-19 virus. This is the start date of the app. Else current date will be used. 
        };
        this.onLeftButtonClick = this.onLeftButtonClick.bind(this);
        this.onRightButtonClick = this.onRightButtonClick.bind(this);
        this.updater = this.myupdater.bind(this);
        this.eventparser = this.eventparser.bind(this);
        this.getData = this.getData.bind(this);
    }


    eventparser(first,last,items,sum_power,min_temp,min_humidity,max_temp,max_humidity){
        let tempmapvaluemax = new Map();
        let tempmapvaluemin = new Map();
        let humimapvaluemax = new Map();
        let humimapvaluemin = new Map();
        let powermapvaluesum = new Map();
        
        for(let i=first;i<=last;i++){
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

        return {"mint": min_temp,"minh": min_humidity, "maxt": max_temp,"maxh": max_humidity,"sump": sum_power};
    }

    myupdater(items, newDate,monthswitch,myitems,firstload){
        let sum_power = [];
        let min_temp = [];
        let min_humidity = [];
        let max_temp = [];
        let max_humidity = [];

        let reel;
        let first =  parseInt(moment.utc(newDate).startOf('week').format("D"));                       // parseInt(moment.utc(items[0]["Time_Stamp"]).format("D"));
        let last =   parseInt(moment.utc(newDate).endOf('week').format("D"));                       // parseInt(moment.utc(items[items.length-1]["Time_Stamp"]).format("D"));
        // This condition is satisfied when a person goes to previous month. Half the week is in past month half in new month.
        if(first>last){
            if(monthswitch==1){
                let semilast = parseInt(moment.utc(newDate).startOf('week').endOf('month').format("D"));
                if(firstload==1){

                    reel = this.eventparser(first,semilast,myitems,sum_power,min_temp,min_humidity,max_temp,max_humidity);
                }else{
                    reel = this.eventparser(first,semilast,items,sum_power,min_temp,min_humidity,max_temp,max_humidity);
                }
                first = 1;
                min_temp = [...reel["mint"],...min_temp];
                max_temp = [...reel["maxt"],...max_temp];
                min_humidity = [...reel["minh"],...min_humidity];
                max_humidity = [...reel["maxh"],...max_humidity];
                sum_power = [...reel["sump"],...sum_power];

            }else{
                last = parseInt(moment.utc(newDate).endOf('month').format("D"));
            }
        }

        let ret = this.eventparser(first,last,items,sum_power,min_temp,min_humidity,max_temp,max_humidity);

        if(monthswitch == 2){
            let thestart = parseInt(moment.utc(newDate).endOf('week').startOf('month').format("D"));
            let thestop = parseInt(moment.utc(newDate).endOf('week').format("D"));
            let thereel = this.eventparser(thestart,thestop,items,sum_power,min_temp,min_humidity,max_temp,max_humidity);
            ret["mint"] = [...ret["mint"],...thereel["mint"]];
            ret["maxt"] = [...ret["maxt"],...thereel["maxt"]];
            ret["minh"] = [...ret["minh"],...thereel["minh"]];
            ret["maxh"] = [...ret["maxh"],...thereel["maxh"]];
            ret["sump"] = [...ret["sump"],...thereel["sump"]];

        }


        console.log("Min Humidity : "+ret["minh"]);
        console.log("Max Humidity : "+ret["maxh"]);
        console.log("Max Temperature : "+ret["maxt"]);
        console.log("Min Temperature : "+ret["mint"]);
        console.log("Sum power : "+ret["sump"]);


        this.setState({
            weektempmax: ret["maxt"],
            weektempmin: ret["mint"],
            weekhumimax: ret["maxh"],
            weekhumimin: ret["minh"],
            weekpowersum: ret["sump"],
            fetching: false,
            date: newDate,
        });
    }

    getData(){
        console.log("Something 3");
        let latestweekstart = moment.utc().startOf('week');
        let latestweekend = moment.utc().endOf('week');
        if(moment.utc(this.state.date).isSameOrAfter(latestweekstart) && moment.utc(this.state.date).isSameOrBefore(latestweekend)){
            console.log("Something 2");
            let DATE_RFC1128 = "ddd, DD MMM YYYY HH:mm:ss [GMT]";
            let start = moment.utc(this.state.date).startOf('day');
            let stop = moment.utc(this.state.date).endOf('date');
            let monthend = 0;
            if(parseInt(latestweekstart.format("M"))!=parseInt(latestweekend.format("M"))){
                monthend = 2;
            }
            let uri = 'http://118.185.27.157:5000/energygrid1?max_results=30000&where=_created>="'+start.format(DATE_RFC1128)+'" and _created<="'+stop.format(DATE_RFC1128)+'"';
            fetch(uri).then(response => response.json())
                .then(item => {
                    console.log("Something 1");
                    item = item["_items"];
                    AsyncStorage.setItem(start.format("DMMYYYY"),JSON.stringify(item));
                    let startweek = start.startOf('week');
                    let endweek = moment.utc();
                    let keyarr =[];
                    while(startweek.isBefore(endweek.startOf('day'))){
                        keyarr = [...keyarr,startweek.format('DMMYYYY')];
                        startweek.add(1, 'days')
                    }
                    console.log("Updater running keys"+keyarr);
                    AsyncStorage.multiGet(keyarr, (err, stores) => {
                        let passdata = [];
                        for(let i=0;i<stores.length;i++){
                            if(stores[i][1]!=null){
                                passdata = [...passdata,...JSON.parse(stores[i][1])];
                            }
                        } 
                        this.myupdater([...passdata,...item],moment.utc(),monthend,[],0);
            
                    } );
                })
        }
    }

    componentDidMount(){
        this.setState({fetching: true});
        this.getData();
        let monthend = 0;
        this.intervalid = setInterval(() => this.getData(),120000);
        let keyarr =[];
        let newend = moment.utc();
        let endweek = moment.utc().endOf('week');
        let monthstart = moment.utc().startOf('week');
        console.log(monthstart);
        while(monthstart.isSameOrBefore(newend)){
            keyarr = [...keyarr,monthstart.format('DMMYYYY')];
            monthstart.add(1, 'days')
        }

        console.log("keyarr"+keyarr);
        if(parseInt(monthstart.format("M"))!=parseInt(endweek.format("M"))){
            monthend = 2;
        }

        AsyncStorage.multiGet(keyarr, (err, stores) => {
            let passdata = [];
            for(let i=0;i<stores.length;i++){
                if(stores[i][1]!=null){
                    passdata = [...passdata,...JSON.parse(stores[i][1])];
                }
            } 
            this.myupdater(passdata,newend,monthend);
            
          });
    }

    componentWillUnmount(){
        clearInterval(this.intervalid);
    }

    onLeftButtonClick(){
        let DATE_RFC1128 = "ddd, DD MMM YYYY HH:mm:ss [GMT]";
        let newDate = moment.utc(this.state.date).subtract(7,'days').endOf('week').format("YYYY-MM-DD");
        let firstload = 0;
        console.log("New Date when left button clicked "+newDate);
        this.setState({fetching: true});
        let monthswitch = 0;
        let startdate = moment.utc(newDate).startOf('week');
        let enddate = moment.utc(newDate).endOf('week');
        console.log("StartDate "+startdate.format("DMMYYYY"));
        let www;
        console.log("End date "+enddate.format("DMMYYYY")); 
        if(parseInt(startdate.format("M"))!=parseInt(moment.utc(this.state.date).format("M"))){
            if(parseInt(startdate.format("M"))!=parseInt(enddate.format("M"))){
                monthswitch = 1;
            }
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
                                www = AsyncStorage.setItem(j+startdate.format("MMYYYY"),JSON.stringify(mymap.get(j)));
                            }  
                            
                            if(monthswitch == 0)
                                 this.myupdater(items,newDate,monthswitch,[],firstload);
                            else{
                            
                                www.then(res=>{
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
                                        this.myupdater(passdata,newDate,monthswitch,items,firstload);
                            
                                    } );

                                })
                            }
                            
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
                        this.myupdater(passdata,newDate,monthswitch,[],firstload);
            
                    } );
                }
            })
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
                this.myupdater(passdata,newDate,monthswitch,[],firstload);
    
            } );
        }
          
    }

    onRightButtonClick(){
        let DATE_RFC1128 = "ddd, DD MMM YYYY HH:mm:ss [GMT]";
        let newDate = moment.utc(this.state.date).add(7,'days').endOf('week').format("YYYY-MM-DD");
        if(moment.utc(newDate).isAfter(moment.utc())){
            newDate =  moment.utc().format("YYYY-MM-DD");
        }
        console.log("New Date when right button clicked "+newDate);
        this.setState({fetching: true});
        let monthswitch = 0;
        let dateforpassing = moment.utc(newDate).startOf('week');
        let startdate = moment.utc(newDate).startOf('week');
        let enddate = moment.utc(newDate).endOf('week');
        console.log("StartDate "+startdate.format("DMMYYYY"));
        console.log("End date "+enddate.format("DMMYYYY")); 
        if(parseInt(startdate.format("M"))!=parseInt(enddate.format("M"))){
            monthswitch = 2;
        }

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
            this.myupdater(passdata,dateforpassing,monthswitch);
            
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

        const weektempmax = this.state.weektempmax;
        const weektempmin = this.state.weektempmin;
        const weekhumimax = this.state.weekhumimax;
        const weekhumimin = this.state.weekhumimin;
        const weekpowersum = this.state.weekpowersum;
        const date = moment.utc(this.state.date);

        const current = [];


        return (
            <View >
                <ScrollView>
                    <ActivityIndicator size={"large"} style={styles.spinner} animating={this.state.fetching}/>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}> 
                            <Button title="Pevious week" onPress={() => {this.onLeftButtonClick()}}/>
                            <Button title="Next week" onPress={() => {this.onRightButtonClick()}}/>
                        </View>
                        <MinMaxChartCustom max={weektempmax} min={weektempmin} date={date} type={"room temperature (red-max, blue-min)"} numtype={0}></MinMaxChartCustom>
                        <MinMaxChartCustom max={weekhumimax} min={weekhumimin} date={date} type={"room humidity (red-max blue-min)"} numtype={1}></MinMaxChartCustom>
                        <BarChartComp data={weekpowersum} type={"total power per day "} numtype={3} weekly={true} date={moment.utc(this.state.date).endOf('week')} ></BarChartComp>
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