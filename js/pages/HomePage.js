/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Image,
    Text,
    View,
    DeviceEventEmitter,


} from 'react-native';
import TabNavigator from 'react-native-tab-navigator'
import PopularPage from "./popular/PopularPage";
import Toast ,{DURATION}from "react-native-easy-toast";
import TrendingPage from "./trending/TrendingPage";
import FavoritePage from "./favorite/FavoritePage";
import MyPage from "./My/MyPage";
import BaseComponent from "./BaseComponent";
import codePush from "react-native-code-push";


export const ACTION_HOME = {A_SHOW_TOAST:'showToast',A_RESTART:'restart',A_THEME:'THEME'};
export const FLAG_TAB={
    flag_popularTab:'tb_popular',
    flag_trendingTab:'tb_trending',
    flag_favoriteTab:'tb_favorite',
    flag_myTab:'tb_my',
}
export default class HomePage extends BaseComponent {
    constructor(props) {
        super(props);
        let selectedTab=this.props.selectedTab?this.props.selectedTab:'tb_popular';
        this.state = {
            selectedTab: selectedTab,
            theme:this.props.theme,
        }
    }

    componentDidMount(): void {
        super.componentDidMount();
        this.listener = DeviceEventEmitter.
        addListener('ACTION_HOME',
            (action,params)=>this.onAction(action,params));
        this.update();
    }

    /**
     * 想codepush检查更新
     */
    update(){
        codePush.sync({
            updateDialog:{
                appendReleaseDescription:true,
                descriptionPrefix:'更新内容',
                title:'更新',
                mandatoryUpdateMessage:'',
                mandatoryContinueButtonLabel:'更新',
            },
            mandatoryInstallMode:codePush.InstallMode.ON_NEXT_RESTART,
        });
    }

    /**
     * 通知回调事件处理
     * @param action
     * @param params
     */
    onAction(action,params){
        if(ACTION_HOME.A_RESTART===action){
            this.onRestart(params)
        }else if(ACTION_HOME.A_SHOW_TOAST===action){
            this.toast.show(params.text,DURATION.LENGTH_SHORT);
        }
    }

    /**
     * 重启首页
     * @param jumpToTab
     */
    onRestart(jumpToTab){
        this.props.navigator.resetTo({
            component:HomePage,
            params:{
                ...this.props,
                selectedTab:jumpToTab
            }
        })
    }
    componentWillUnmount(): void {
        super.componentWillUnmount();
        if (this.listener) {
            this.listener.remove();
        }
    }
    _renderType(Component,selectTab,title,renderIcon){
        return  <TabNavigator.Item
            selected={this.state.selectedTab === selectTab}
            selectedTitleStyle={this.state.theme.styles.selectedTitleStyle}
            title={title}
            renderIcon={() => <Image style={styles.image} source={renderIcon}/>}
            renderSelectedIcon={() => <Image style={[styles.image,this.state.theme.styles.tabBarSelectedIcon]} source={renderIcon}/>}
            // badgeText="1"
            onPress={() => this.setState({selectedTab: selectTab})}>
            <View style={styles.page1}>
                <Component {...this.props} theme={this.state.theme}/>
            </View>
        </TabNavigator.Item>
    }

    render() {
        return (
            <View style={styles.container}>
                <TabNavigator>
                    {this._renderType(PopularPage,'tb_popular','最热',require('../../res/images/ic_polular.png'))}
                    {this._renderType(TrendingPage,'tb_trending','趋势',require('../../res/images/ic_trending.png'))}
                    {this._renderType(FavoritePage,'tb_favorite','收藏',require('../../res/images/ic_favorite.png'))}
                    {this._renderType(MyPage,'tb_my','我的',require('../../res/images/ic_my.png'))}
                </TabNavigator>
                <Toast ref={toast=>this.toast=toast}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    page1:{
        flex: 1,
    },
    page2:{
        flex: 2,
        backgroundColor: 'green'
    },
    image:{
        width:22,
        height:22
    }
});
