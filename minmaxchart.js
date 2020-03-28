import * as React from 'react';
import { View, Text } from 'react-native';
import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts'
import * as scale from 'd3-scale'
import moment, { months } from 'moment'


class MinMaxChartCustom extends React.PureComponent {

    render() {
        const amin = this.props.min;
        const amax = this.props.max;
        const min = this.props.min.map((value) => ({ value }))
        const max = this.props.max.map((value) => ({ value }))
        const weeknum = Math.floor(this.props.date.format("DD") / 7); 
        let conn;
        if(this.props.numtype == 0){
            conn = [...amin,...amax,40];
        }else{
            conn = [...amin,...amax,100];
        }


        const data1 = ['SUN','MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((value) => ({ value }))
        const barData = [
            {
                data: max,
                svg: {
                    fill: 'rgba(255, 0, 0,0.8)',
                },
            },
            {
                data: min,
                svg: {
                  fill: 'rgba(0, 0, 255,0.8)',
                },
            },
        ]

        let flag =0;
        for(let i = 0;i<7;i++){
            if(amin[i] != 0 || amax[i] != 0 ){
                flag = 1;
            }
        }
        if(flag == 0){
            return(
                <View style={{flexDirection: "column", height: 400, padding: 30,fontSize: 30}}>
                    <Text>No data available for the week.</Text>
                </View>
            )
        }

        return (
          <View  style={{ flexDirection: 'column', height: 400, padding: 20 }}>
            <Text>Graph for {this.props.type}.Week :{weeknum} of {this.props.date.format("MM/YYYY")}</Text>
            <View style={{ flexDirection: 'row', height: 300}}>
                <YAxis
                    style={{ width: 40}}
                    data={ conn }
                    yAccessor={({ item }) => item}
                    numberOfTicks={10}
                    labelStyle={ { color: 'black' } }
                    contentInset={ { top: 10, bottom: 20 } }
                    svg={{ fontSize: 12, fill: 'black' }}

                />
                <BarChart
                    style={ { flex: 1 } }
                    yMax={this.props.numtype == 0 ? 40 : 100}
                    data={ barData }
                    numberOfTicks = {10}
                    yAccessor={({ item }) => item.value}
                    contentInset={ { top: 10, bottom: 20 } }
                    
                >
                    <Grid/>
                </BarChart>
            </View>
              <XAxis
                style={{ marginTop: 10, paddingLeft: 40, paddingTop: 20}}
                data={ data1 }
                scale={scale.scaleBand}
                xAccessor={({ item }) => item.value}
                formatLabel={ (value, index) => value }
                labelStyle={ { color: 'black' } }
                svg={{ fontSize: 12, fill: 'black' }}
              />
          </View>
        )
    }

}

export default MinMaxChartCustom