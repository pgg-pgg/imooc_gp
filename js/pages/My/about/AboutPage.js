import React, {Component} from 'react';
import {
    View,
    Linking,
} from 'react-native';
import ViewUtils from "../../../util/ViewUtils";
import {MORE_MENU} from "../../../common/MoreMenu";
import GlobalStyles from "../../../../res/styles/GlobalStyles";
import AboutCommon, {FLAG_ABOUT} from "./AboutCommon";
import WebViewPage from "./WebViewPage";
import config from '../../../../res/data/config'
import AboutMePage from "./AboutMePage";


export default class AboutPage extends Component {
    constructor(props) {
        super(props);
        this.aboutCommon = new AboutCommon(props,(dic)=>this.updateState(dic),FLAG_ABOUT.flag_about,config);
        this.state={
            projectModels :[],
            author:config.author
        }
    }

    componentDidMount(): void {
        this.aboutCommon.componentDidMount();
    }

    updateState(dic){
        this.setState(dic);
    }
    onClick(tab){
        let TargetComponent, params = {...this.props, menuType: tab};
        switch (tab) {
            case MORE_MENU.About_Author:
                TargetComponent = AboutMePage;
                break;
            case MORE_MENU.Website:
                TargetComponent = WebViewPage;
                params.url = 'http://www.devio.org/io/GitHubPopular';
                params.title = 'Github Popular';
                break;
            case MORE_MENU.Feedback:
                // var url = '';
                // Linking.canOpenURL(url).then(supported => {
                //     if (!supported) {
                //         console.log('Can\'t handle url: ' + url);
                //     } else {
                //         return Linking.openURL(url);
                //     }
                // }).catch(err => console.error('An error occurred', err));
                break;
        }

        if (TargetComponent) {
            this.props.navigator.push({
                component: TargetComponent,
                params: params,
            });
        }
    }

    render(){
        let content = <View>
            {this.aboutCommon.renderRepository(this.state.projectModels)}
            {ViewUtils.getSettingItem(()=>this.onClick(MORE_MENU.Website),require('../../../../res/images/ic_computer.png'),MORE_MENU.Website,{tintColor:'#2196f3'})}
            <View style={GlobalStyles.line}/>

            {ViewUtils.getSettingItem(()=>this.onClick(MORE_MENU.About_Author),require('../img/ic_insert_emoticon.png'),MORE_MENU.About_Author,{tintColor:'#2196f3'})}
            <View style={GlobalStyles.line}/>

            {ViewUtils.getSettingItem(()=>this.onClick(MORE_MENU.Feedback),require('../../../../res/images/ic_feedback.png'),MORE_MENU.Feedback,{tintColor:'#2196f3'})}
            <View style={GlobalStyles.line}/>

        </View>;
        return this.aboutCommon.renderView(content,{
            'name':'Github Popular',
            'description':'这是一个用来查看GitHub最受欢迎与最热项目的App,它基于React Native支持Android和iOS双平台.',
            'avatar':this.state.author.avatar1,
            'backgroundImg':this.state.author.backgroundImg1,
        })
    }
}

