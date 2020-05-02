import React from 'react'
import { View, Text, ScrollView , StyleSheet} from 'react-native'
import moment from 'moment';
import { Svg, Circle } from 'react-native-svg';
import {Text as TextSvg} from 'react-native-svg';
import BarChartComp from './barchart';



class MonthChart extends React.PureComponent {

    constructor(props){
        super();
        //console.log("Printing date in constrctor "+moment.utc(props.date).format("DDMMYYYY"));
        this.state={
            monthDate :  props.date,
            today: moment.utc(),
            selectedday: -1,
            selected: 0, // 0 - power, 1 - Temp, 2 - Humidity 
        };
        this.year = this.year.bind(this);
        this.month = this.month.bind(this);
        this.daysInMonth = this.daysInMonth.bind(this);
        this.currentDate = this.currentDate.bind(this);
        this.currentDay = this.currentDay.bind(this);
        this.firstDayOfMonth = this.firstDayOfMonth.bind(this);
        this.onHumidityClick = this.onHumidityClick.bind(this);
        this.onPowerClick = this.onPowerClick.bind(this);
        this.onTempClick = this.onTempClick.bind(this);
        this.changeselectedday = this.changeselectedday.bind(this);
    }


    months = moment.months();



    changeselectedday(d){
        this.setState({
            selectedday: d,
        });
    }

    year(){
        return this.state.monthDate.format("Y");
    }

    month(){
       return this.state.monthDate.format("MMMM");
    }

    daysInMonth(){
        return parseInt(moment.utc(this.props.date).daysInMonth());
    }

    currentDate(){
        return this.state.monthDate.get("date");
    }

    currentDay(){
        return this.state.monthDate.format("D");
    }


    firstDayOfMonth(){
        let mydate = this.state.monthDate;
        let firstDay = parseInt(moment.utc(this.props.date).startOf('month').format('d'));
        return firstDay;
    }


    onPowerClick(){
        this.setState({
            selected: 0,
        });
    }

    onTempClick(){
        this.setState({
            selected: 1,
        });
    }

    onHumidityClick(){
        this.setState({
            selected: 2,
        });
    }

    render() {

        const width = 100;
        const height = 100;
        const size = width < height ? width - 32 : height - 16;
        const strokeWidth = 25;
        const radius = (size - strokeWidth) / 2;
        const circunference = radius * 2 * Math.PI;

        //We will use min max 
        let tempdate = [];
        let max=this.props.temp[0];
        let min=this.props.temp[0];
        
        for(let i = 1;i<this.props.temp.length;i++){
            if(this.props.temp[i]==0){
                continue;
            }
            if(max<this.props.temp[i]){
                max = this.props.temp[i];
            }
            if(min>this.props.temp[i]){
                min = this.props.temp[i];
            }
        }

        //console.log("Max "+max);
        for(let i = 0;i<this.props.temp.length;i++){
            if(this.props.temp[i]==0){
                tempdate.push(0);
                continue;
            }
            let num = ((this.props.temp[i] - min)/(max-min))*(29.5-0);
            if(isNaN(num)){
                num=29.5;
            }
            tempdate.push(num);
        }

        //console.log("Temp "+tempdate);

        let circlepower = [];
        max=this.props.power[0];
        min=this.props.power[0];
        for(let i = 1;i<this.props.power.length;i++){
            if(this.props.power[i]==0){
                continue;
            }
            if(max<this.props.power[i]){
                max = this.props.power[i];
            }
            if(min>this.props.power[i]){
                min = this.props.power[i];
            }
        }
        for(let i = 0;i<this.props.power.length;i++){
            if(this.props.power[i]==0){
                circlepower.push(0);
                continue;
            }
            let num = ((this.props.power[i] - min)/(max-min))*(29.5-0);
            if(isNaN(num)){
                num=29.5;
            }
            circlepower.push(num);
        }

        //console.log("Power "+circlepower);

        let circlehumidity = [];
        max = this.props.humidity[0];
        min = this.props.humidity[0];
        for(let i = 1;i<this.props.humidity.length;i++){
            if(this.props.humidity[i]==0){
                continue;
            }
            if(max<this.props.humidity[i]){
                max = this.props.humidity[i];
            }
            if(min>this.props.humidity[i]){
                min = this.props.humidity[i];
            }
        }

        for(let i = 0;i<this.props.humidity.length;i++){
            if(this.props.humidity[i]==0){
                circlehumidity.push(0);
                continue;
            }
            let num = ((this.props.humidity[i] - min)/(max-min))*(29.5-0);
            if(isNaN(num)){
                num=29.5;
            }
            circlehumidity.push(num);
        }

        //console.log("Humidity "+circlehumidity);


        let blanks = [];
        for(let i = 0;i<this.firstDayOfMonth();i++){
            blanks.push(
                <Svg width={width} height={height}>
                <TextSvg
                  stroke="black"
                  fontSize="15"
                  x={size / 2}
                  y={size / 2}
                  textAnchor="middle"
                  
                >
                  {'\b\b\b\b'}
                </TextSvg>
                <Circle
                  fill='rgba(0, 0, 255,0.3)'
                  cx={size / 2}
                  cy={size / 2}
                  r={0}
                />
              </Svg>
            );
        }

        //console.log("Selected day "+this.state.selected);
        //console.log("power "+circlepower);
        //console.log("temp "+tempdate);
        //console.log("humdidity "+circlehumidity);


        let daysmonth = [];
        for(let i = 1; i<=this.daysInMonth();i++){
            daysmonth.push(
                <Svg onPress={()=>{this.changeselectedday(i-1)}} width={width} height={height}>
                <TextSvg
                  stroke="black"
                  fontSize="15"
                  x={size / 2}
                  y={size / 2}
                  textAnchor="middle"
                 
                >
                  {i<10 ?  '0'+i : i}
                </TextSvg>
                <Circle
                  fill='rgba(0,50,130,0.3)'
                  cx={size / 2}
                  cy={size / 2}
                  r={this.state.selected == 0 ? circlepower[i-1] : (this.state.selected == 1 ? tempdate[i-1] : circlehumidity[i-1])}
                  
                />
              </Svg>
            );
        }

        let aftermonth = [];
        for(let i = parseInt(moment.utc(this.props.date).endOf('month').day());i<6;i++ ){
            aftermonth.push(
                <Svg width={width} height={height}>
                <TextSvg
                  stroke="black"
                  fontSize="15"
                  x={size / 2}
                  y={size / 2}
                  textAnchor="middle"
                >
                  {'\b\b\b\b'}
                </TextSvg>
                <Circle
                  fill='rgba(0, 0, 255,0.3)'
                  cx={size / 2}
                  cy={size / 2}
                  r={0}
                />
              </Svg>
            );
        }

        let alldays = [...blanks,...daysmonth,...aftermonth];
        let rows = [];
        let cells = [];


        alldays.forEach((row,i)=>{
            if((i%7) !== 0 || i == 0){
                cells.push(row);
            }else{
                if(i!=0){
                    let insertRow = cells.slice();
                    //console.log("Insrting rows");
                    //console.log(insertRow);
                    rows.push(insertRow);
                    cells = [];
                    cells.push(row);
                }
            }
            if(i === alldays.length-1){
                let insertRow = cells.slice();
                rows.push(insertRow);
            }
        });
        let trElements = rows.map((d,i)=>{
            return (
                <View style={{marginLeft: 10, height: 50,flexDirection: 'row', justifyContent: 'space-around'}} >
                    {d}
                </View>
            );
        });


        let sel = this.state.selected;

        //console.log(trElements[0]);

        let info;
        if(this.state.selectedday == -1){
            info = <View style={{marginTop: 20,flexDirection: 'row',justifyContent: 'space-around'}}><Text>No date selected</Text></View>
        }else{
            info = (                    <View style={{marginTop: 50}}>
                <Text style={{textAlign: 'center'}}>Info for date {this.state.selectedday+1+"/"+moment.utc(this.props.date).format("MM/YYYY")}</Text>
                <Text style={{marginLeft: 20}}>Temperature</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                    <Text>Max</Text>
                    <Text>{this.props.temp[this.state.selectedday].toFixed(2)+" \u2103"}</Text>
                    <Text>Min</Text>
                    <Text>{this.props.temp_min[this.state.selectedday].toFixed(2)+" \u2103"}</Text>
                </View>
                <Text style={{marginLeft: 20, marginTop: 10}}>Humidity</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                    <Text>Max</Text>
                    <Text>{this.props.humidity[this.state.selectedday].toFixed(2)+" \u0025"}</Text>
                    <Text>Min</Text>
                    <Text>{this.props.humidity_min[this.state.selectedday].toFixed(2)+" \u0025"}</Text>
                </View>
                <View style={{marginTop:10, marginLeft: 20, flexDirection: 'row'}}>
                    <Text>Power Sum</Text>
                    <Text style={{marginLeft: 15}} >{this.props.power[this.state.selectedday].toFixed(2)} Watt/Day</Text>
                </View>
            </View>);
        }

        return (

    
                <View style={{
                    
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'stretch',
                    marginTop: 30
                }}>

                    <View style={{height: 50,justifyContent: 'center', flexDirection: 'row', justifyContent: 'space-around'}} >
                        <Text style={{height: 30, textAlignVertical: 'center', textAlign: 'center'}} >Month : {moment.utc(this.props.date).format("MMMM YYYY")} </Text>
                        <Text onPress={() => {this.onPowerClick()}} style={{borderColor: sel == 0 ? 'red' : 'grey', borderWidth: 2, height: 30, width: 50 ,borderRadius: 10, textAlignVertical: 'center' , textAlign: 'center'}}>Power</Text>
                        <Text onPress={() => {this.onTempClick()}} style={{borderColor: sel == 1 ? 'red' : 'grey', borderWidth: 2, height: 30, width: 50 ,borderRadius: 10, textAlignVertical: 'center' , textAlign: 'center'}}>Temp</Text>
                        <Text onPress={() => {this.onHumidityClick()}} style={{borderColor: sel == 2 ? 'red' : 'grey', borderWidth: 2, height: 30, width: 100 ,borderRadius: 10, textAlignVertical: 'center' , textAlign: 'center'}}>Humidity</Text>
                    </View>
                    <View style={{height: 20,flexDirection: 'row',justifyContent: 'space-around'}} >
                        <Text style={{width: 100,textAlign: 'center',alignSelf: 'center'}}>Sun{'\b'}</Text>
                        <Text style={{width: 100,textAlign: 'center',textAlignVertical: 'center'}} >Mon</Text>
                        <Text style={{width: 100,textAlign: 'center',alignSelf: 'center'}}>Tue{'\b'}</Text>
                        <Text style={{width: 100,textAlign: 'center',alignSelf: 'center'}}>Wed{'\b'}</Text>
                        <Text style={{width: 100,textAlign: 'center',alignSelf: 'center'}}>Thu{'\b'}</Text>
                        <Text style={{width: 100,textAlign: 'center',alignSelf: 'center'}}>Fri{'\b'}{'\b'}{'\b'}</Text>
                        <Text style={{width: 100,textAlign: 'center',alignSelf: 'center'}}>Sat{'\b'}{'\b'}{'\b'}</Text>
                    </View>
                    {trElements}
                    {info}
                </View>
        )
    }

}

export default MonthChart