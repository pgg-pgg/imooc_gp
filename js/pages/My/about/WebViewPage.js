import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    WebView,
} from 'react-native'
import NavigationBar from "../../../common/NavigationBar";
import * as GlobalStyles from "../../../../res/styles/GlobalStyles";
import ViewUtils from "../../../util/ViewUtils";

export default class WebViewPage extends Component{
    constructor(props){
        super(props)
        this.state={
            url:this.props.url,
            title:this.props.title,
            canGoBack:false,
            theme:this.props.theme,
        }
    }
    onBackPress(){
        if (this.state.canGoBack) {
            this.webView.goBack()
        }else {
            this.props.navigator.pop()
        }

    }
    onNavigationStateChange(e){
        this.setState({
            canGoBack:e.canGoBack,
        })
    }
    render(){

        let statusBar = {
            backgroundColor:this.state.theme.themeColor
        };
        return <View style={GlobalStyles.root_container}>
            <NavigationBar title={this.props.title}
                           leftButton={ViewUtils.getLeftButton(()=>this.onBackPress())}
                           statusBar={statusBar}
                           style={this.state.theme.styles.navBar} />
            <WebView ref={webView=>this.webView=webView} source={{uri:this.state.url}} onNavigationStateChange={(e)=>
            this.onNavigationStateChange(e)}>
            </WebView>
        </View>
    }

}

