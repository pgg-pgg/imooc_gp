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
            canGoBack:false
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
        return <View style={GlobalStyles.root_container}>
            <NavigationBar title={this.props.title}
                           leftButton={ViewUtils.getLeftButton(()=>this.onBackPress())}
                           statusBar={{backgroundColor: '#2196f3'}}
                           style={{backgroundColor: '#2196f3'}} />
            <WebView ref={webView=>this.webView=webView} source={{uri:this.state.url}} onNavigationStateChange={(e)=>
            this.onNavigationStateChange(e)}>
            </WebView>
        </View>
    }

}

