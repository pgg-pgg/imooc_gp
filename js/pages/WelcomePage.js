import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Image,
    Text,
    View, AsyncStorage,
} from 'react-native';
import NavigationBar from "../common/NavigationBar"
import HomePage from "./HomePage"
import GuidePage from "./GuidePage";
export default class WelcomePage extends Component{

    openApp(){
        AsyncStorage.getItem('isFirst',(error,result)=>{

            if (result === 'false') {
                console.log('不是第一次打开');

                this.props.navigator.resetTo({
                    component:HomePage,
                    params:{
                        ...this.props
                    }
                })

            } else  {

                console.log('第一次打开');

                this.props.navigator.replace({
                    component:GuidePage
                })
            }
        });
    }
    componentDidMount(): void {
        this.timer = setTimeout(()=>{
            this.openApp()
        },2000)
    }

    componentWillUnmount(): void {
        this.timer&&clearTimeout(this.timer);
    }

    constructor(props){
        super(props)
    }

    render(){
        return <View style={{flex:1}}>
            <NavigationBar style={{backgroundColor: '#2196f3'}} title={'欢迎页'}/>
            <View style={{flex:1,justifyContent: 'center',backgroundColor:'#2196f3'}}>
                <Text style={{textAlign:'center',alignItems: 'center',color:'white',fontSize:20}}>欢迎来到去哪儿</Text>
            </View>
        </View>
    }
}
