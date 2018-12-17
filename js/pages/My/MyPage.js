import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableHighlight,
    Image,
} from 'react-native';
import NavigationBar from "../../common/NavigationBar";
import GlobalStyles from "../../../res/styles/GlobalStyles"
import ViewUtils from "../../util/ViewUtils";
import CustomKeyPage from "./CustomKeyPage";
import {FLAG_LANGUAGE} from "../../expand/dao/LanguageDao";
import SortKeyPage from "./SortKeyPage";
import AboutMePage from "./about/AboutMePage";
import AboutPage from "./about/AboutPage";
import {MORE_MENU} from "../../common/MoreMenu";
import CustomTheme from "./CustomTheme";

export default class MyPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            customThemeViewVisible: false,
        }
    }

    onClick(tab) {
        let TargetComponent, params = {...this.props, menuType: tab};
        switch (tab) {
            case MORE_MENU.Custom_Language:
                TargetComponent = CustomKeyPage;
                params.flag = FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.Custom_Key:
                TargetComponent = CustomKeyPage;
                params.flag = FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.Remove_Key:
                TargetComponent = CustomKeyPage;
                params.flag = FLAG_LANGUAGE.flag_key;
                params.isRemoveKey = true;
                break;
            case MORE_MENU.Sort_Language:
                TargetComponent = SortKeyPage;
                params.flag = FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.Sort_Key:
                TargetComponent = SortKeyPage;
                params.flag = FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.Custom_Theme:
                this.setState({customThemeViewVisible: true});
                break;
            case MORE_MENU.About_Author:
                TargetComponent = AboutMePage;
                break;
            case MORE_MENU.About:
                TargetComponent = AboutPage;
                break;
            case '更新':
                // this.update();
                break;

        }

        if (TargetComponent) {
            this.props.navigator.push({
                component: TargetComponent,
                params: params,
            });
        }
    }

    getItem(tag, icon, text) {
        return ViewUtils.getSettingItem(() => this.onClick(tag), icon, text, {tintColor: '#2196f3'}, null);
    }


    renderCustomThemeView() {
        return (
            <CustomTheme visible={this.state.customThemeViewVisible}
                         {...this.props}
                         onClose={() => {
                             this.setState({
                                 customThemeViewVisible: false,
                             })
                         }}/>
        )
    }

    render() {
        let navigatorBar = <NavigationBar title={'我的'} statusBar={{backgroundColor: '#2196f3'}}
                                          style={{backgroundColor: '#2196f3'}}/>;
        return <View style={GlobalStyles.root_container}>
            {navigatorBar}
            <ScrollView>
                {/*最热管理*/}
                <TouchableHighlight onPress={() => this.onClick(MORE_MENU.About)}>
                    <View style={[styles.item, {height: 90}]}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={require('../../../res/images/ic_trending.png')}
                                   style={[{width: 40, height: 40, marginRight: 10}, {tintColor: '#2196f3'}]}/>

                            <Text>Github Popular</Text>
                        </View>
                        <Image style={[{marginRight: 10, height: 22, width: 22,}, {tintColor: '#2196f3'}]}
                               source={require('../../../res/images/ic_tiaozhuan.png')}/>
                    </View>
                </TouchableHighlight>
                <View style={GlobalStyles.line}/>
                {/*趋势管理*/}
                <Text style={styles.groupTitle}>趋势管理</Text>
                <View style={GlobalStyles.line}/>
                {/*自定义语言*/}
                {this.getItem(MORE_MENU.Custom_Language, require('./img/ic_custom_language.png'), '自定义语言')}
                <View style={GlobalStyles.line}/>
                {/*语言排序*/}
                {this.getItem(MORE_MENU.Sort_Language, require('./img/ic_sort.png'), '语言排序')}
                <View style={GlobalStyles.line}/>

                {/*标签管理*/}
                <Text style={styles.groupTitle}>标签管理</Text>
                <View style={GlobalStyles.line}/>
                {/*自定义标签*/}
                {this.getItem(MORE_MENU.Custom_Key, require('./img/ic_custom_language.png'), '自定义标签')}
                <View style={GlobalStyles.line}/>
                {/*标签排序*/}
                {this.getItem(MORE_MENU.Sort_Key, require('./img/ic_swap_vert.png'), '标签排序')}
                <View style={GlobalStyles.line}/>
                {/*标签移除*/}
                {this.getItem(MORE_MENU.Remove_Key, require('./img/ic_remove.png'), '标签移除')}
                <View style={GlobalStyles.line}/>
                {/*设置*/}
                <Text style={styles.groupTitle}>设置</Text>
                <View style={GlobalStyles.line}/>
                {this.getItem(MORE_MENU.Custom_Theme, require('./img/ic_custom_theme.png'), '自定义主题')}
                <View style={GlobalStyles.line}/>
                {this.getItem(MORE_MENU.About_Author, require('./img/ic_insert_emoticon.png'), '关于作者')}
                <View style={GlobalStyles.line}/>


            </ScrollView>

            {this.renderCustomThemeView()}
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        height: 60,
        backgroundColor: 'white',
    },
    groupTitle: {
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 5,
        fontSize: 12,
        color: 'gray',

    }
});
