import {StyleSheet, View, Button, Text, Image, TouchableOpacity,AsyncStorage} from 'react-native';
import React, {Component} from 'react';
import {PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator} from 'rn-viewpager';
import HomePage from "./HomePage";

export default class GuidePage extends Component {
    render() {
        let text1 = '消费者第一\n合作伙伴第二\nQunar第三';
        let text2 = '大声说话\n无\'总\'称谓\n遇到批评三不问';
        let text3 = '高层不诿过\n中层不放羊\n基层不跳步';

        return (
            <View style={{flex: 1}}>
                <IndicatorViewPager
                    style={{flex: 1}}
                    indicator={GuidePage._renderDotIndicator()}>
                    <View style={{backgroundColor: '#ff8800', justifyContent: 'center'}}>
                        <Image resizeMode={'contain'} style={styles.image}
                               source={require('../../res/images/s_0_1.png')}/>
                        <Text style={styles.text_desc}>{text1}</Text>
                    </View>
                    <View style={{backgroundColor: '#669900', justifyContent: 'center'}}>
                        <Image resizeMode={'contain'} style={styles.image}
                               source={require('../../res/images/s_1_1.png')}/>
                        <Text style={styles.text_desc}>{text2}</Text>
                    </View>
                    <View style={{backgroundColor: '#aa66cc', justifyContent: 'center'}}>
                        <Image resizeMode={'contain'} style={styles.image}
                               source={require('../../res/images/s_2_1.png')}/>
                        <Text style={styles.text_desc}>{text3}</Text>
                        <TouchableOpacity onPress={()=>{
                            // 存储
                            AsyncStorage.setItem('isFirst','false',(error)=>{
                                if (error) {
                                    alert(error);
                                }
                            });
                            this.props.navigator.resetTo({
                                component:HomePage
                            })
                        }}>
                            <Text style={styles.text}>开始使用</Text>
                        </TouchableOpacity>
                    </View>
                </IndicatorViewPager>
            </View>
        );
    }


    static _renderDotIndicator() {
        return <PagerDotIndicator pageCount={3}/>;
    }

}

const styles = StyleSheet.create({
    text: {
        alignSelf: 'center',
        padding: 5,
        backgroundColor: '#2196f3',
        borderRadius: 5,
        fontSize: 18,
        color: 'white',

    },
    text_desc: {
        height:200,
        textAlign: 'center',
        textAlignVertical:'center',
        fontSize: 20,
        color: 'white',
        alignSelf: 'center',
    },
    image: {
        width: 200,
        height: 200,
        alignSelf: 'center'
    },
    btn: {
        width: 150,
        height: 40,
        backgroundColor: '#1296db',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50

    },
    btnText: {
        fontSize: 18,
        color: '#fff'
    },

});
