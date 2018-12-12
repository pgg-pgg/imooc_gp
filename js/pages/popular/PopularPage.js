import React, {Component} from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import NavigationBar from "../../common/NavigationBar"
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
import PopularTab from "./PopularTab";

export default class PopularPage extends Component {

    constructor(props) {
        super(props);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.state = {
            languages: []
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        this.languageDao.fetch()
            .then(result => {
                this.setState({
                    languages: result
                })
            }).catch(error => {
            console.log(error)
        })
    }

    render() {
        let content = this.state.languages.length > 0 ? <ScrollableTabView
            tabBarBackgroundColor='#2196f3'
            tabBarActiveTextColor='#fff'
            tabBarInactiveTextColor='#333'
            tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
            renderTabBar={() => <ScrollableTabBar/>}>
            {this.state.languages.map((result, i, arr) => {
                let lan = arr[i];
                return lan.checked ?
                    <PopularTab key={i} tabLabel={lan.name} {...this.props}/>: null;
            })}
        </ScrollableTabView> : null;
        return <View style={styles.container}>
            <NavigationBar title={'最热'} statusBar={{backgroundColor: '#2196f3'}} style={{backgroundColor: '#2196f3'}}/>
            {content}
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    page1: {
        flex: 1,
        backgroundColor: 'red'
    },
    page2: {
        flex: 2,
        backgroundColor: 'green'
    },
    image: {
        width: 22,
        height: 22
    },
    item: {
        backgroundColor: '#169',
        height: 100,
        margin: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text_my: {
        color: 'black',
        fontSize: 20,
    },
    text: {
        color: 'white',
        fontSize: 20,
    },
    indicatorContainer: {
        alignItems: 'center'
    },
    indicator: {
        color: 'red',
        margin: 10
    }
});
