import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { BarChart, Grid , XAxis, YAxis } from 'react-native-svg-charts'
import moment, { months } from 'moment';
import * as scale from 'd3-scale'

class BarChartComp extends React.PureComponent {

    render() {

        let data = this.props.data;
        let data1 = [];
        let datamax = Math.max(...data);
        const weeknum = Math.floor(this.props.date.format("DD") / 7); 
        if(this.props.numtype == 3){
            data1 = [0,...data,datamax+20000];
        }else if(this.props.numtype == 2){
            data1 = [0,...data,datamax+500];
        }else{
            data1 = [0,...data,datamax+30];
        }

        let xa = [];
        let dayinfo =  <Text>{this.props.type} Data for Day {this.props.date.format('DD/MM/YYYY')}</Text>;
        if(this.props.weekly){
            xa = ['SUN','MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            dayinfo = <Text>Graph for {this.props.type}.Week :{weeknum} of {this.props.date.format("MM/YYYY")}</Text>;
        }else{
            xa = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
        }

        return (
            <View style={{ flexDirection: 'column', height: 400, padding: 10}}>
                <Text>{dayinfo}</Text>
                <View style={{ flexDirection: 'row', height: 300}}>
                    <YAxis
                        style={{ width: 40}}
                        data={ data1 }
                        yAccessor={({ item }) => item}
                        contentInset={{ top: 10, bottom: 10 }}
                        numberOfTicks={10}
                        formatLabel={ (value, index) => value }
                        labelStyle={ { color: 'black' } }
                        svg={{ fontSize: 12, fill: 'black' }}
                    />
                    <BarChart
                        style= {{flex: 1}}
                        yMax = {this.props.numtype == 2 ? datamax+500 : (this.props.numtype == 3 ? datamax+20000 : datamax+30)}
                        yMin = {0}
                        data={data}
                        yScale = {scale.scaleLinear}
                        svg={{ fill: 'rgba(56, 226, 238, 0.8)' }}
                        contentInset={{ top: 10, bottom: 10 }}
                        yAccessor={({ item }) => item}
                        spacing={0.2}
                        numberOfTicks={10}
                        animationDuration = {2000}
                        animate= {true}
                        spacingInner= {0.2}
                    >
                        <Grid />
                    </BarChart>
                </View>
                <XAxis
                    style={{ marginTop: 10, paddingLeft: 40}}
                    data={ xa }
                    scale={scale.scaleBand}
                    xAccessor={({ item }) => item}
                    labelStyle={ { color: 'black' } }
                    spacingInner= {0.2}
                    svg={{ fill: 'black'}}
                />
        

            </View>
        )
    }

}

export default BarChartComp