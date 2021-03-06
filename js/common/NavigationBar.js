import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {
    Platform,
    View,
    Text,
    Image,
    StyleSheet,
    StatusBar,
} from 'react-native'


const NAVBAR_HEIGHT_ANDROID = 50;
const NAVBAR_HEIGHT_IOS = 44;
const STATUS_BAR_HEIGHT = 20;
const StatusBarShape={
    backgroundColor:PropTypes.string,
    barStyle:PropTypes.oneOf(['default','light-content','dark-content']),
    hidden:PropTypes.bool
}

export default class NavigationBar extends Component {
    static propTypes = {
        style: PropTypes.object,
        title: PropTypes.string,
        titleView: PropTypes.element,
        titleLayoutStyle:PropTypes.object,
        hide: PropTypes.bool,
        leftButton: PropTypes.element,
        rightButton: PropTypes.element,
        statusBar: PropTypes.shape(StatusBarShape),
    };

    static defaultProps={
        statusBar:{
            barStyle: 'light-content',
            hidden:false,
        }

    }
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            hide: false,
        }
    }

    render() {
        let status = <View style={[styles.statusBar,this.props.statusBar]}><StatusBar {...this.props.statusBar}/></View>;
        let titleView = this.props.titleView?this.props.titleView:<Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.title}>{this.props.title}</Text>;

        let content = <View style={[styles.navBar,this.props.style]}>
            {this.props.leftButton}
            <View style={[styles.titleViewContainer,this.props.titleLayoutStyle]}>{titleView}</View>
            {this.props.rightButton}
        </View>;
        return (
            <View style={[styles.container,this.props.statusBar]}>
                {status}
                {content}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor:'gray'
    },
    navBar:{
        justifyContent: 'space-between',
        alignItems: 'center',
        height: Platform.OS ==='ios'?NAVBAR_HEIGHT_IOS:NAVBAR_HEIGHT_ANDROID,
        backgroundColor: 'red',
        flexDirection: 'row',
    },
    titleViewContainer:{
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left:40,
        right:40,
        top:0,
        bottom:0,
    },
    title:{
        fontSize:18,
        color:'white',
    },
    statusBar: {
        height: Platform.OS==='ios'?STATUS_BAR_HEIGHT:0
    }
});
