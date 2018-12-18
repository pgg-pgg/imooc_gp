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
import ThemeDao from "../expand/dao/ThemeDao";
import SplashScreen from 'react-native-splash-screen'
export default class WelcomePage extends Component{

    openApp(){
        AsyncStorage.getItem('isFirst',(error,result)=>{

            if (result === 'false') {
                console.log('不是第一次打开');

                this.props.navigator.resetTo({

                    component:HomePage,
                    params:{
                        theme:this.theme,
                        ...this.props
                    }
                })

            } else  {
                console.log('第一次打开');
                this.props.navigator.replace({
                    component:GuidePage,
                    params:{
                        theme:this.theme,
                        ...this.props
                    }
                })
            }
        });
    }
    componentDidMount(): void {
        new ThemeDao().getTheme().then(data=>{
            this.theme = data;
        })
        this.timer = setTimeout(()=>{
            SplashScreen.hide();
            this.openApp()
        },1000)
    }

    componentWillUnmount(): void {
        this.timer&&clearTimeout(this.timer);
    }

    constructor(props){
        super(props)
    }

    render(){
        return null;
    }
}
