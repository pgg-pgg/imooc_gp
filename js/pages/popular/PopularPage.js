import React, {Component} from 'react';
import {
    Image,
    StyleSheet, TouchableOpacity,
    View,
} from 'react-native';
import NavigationBar from "../../common/NavigationBar";
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
import PopularTab from "./PopularTab";
import ViewUtils from "../../util/ViewUtils";
import SearchPage from "../SearchPage";
import {MORE_MENU} from "../../common/MoreMenu";
import {FLAG_TAB} from "../HomePage";
import MoreMenu from "../../common/MoreMenu";
import BaseComponent from "../BaseComponent";
import CustomTheme from "../My/CustomTheme";

export default class PopularPage extends BaseComponent {

    constructor(props) {
        super(props);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.state = {
            languages: [],
            customThemeViewVisible: false,
            theme:this.props.theme,
        }
    }

    componentDidMount() {
        super.componentDidMount()
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


    renderRightButton() {
        return <View style={{flexDirection:'row'}}>
            <TouchableOpacity
                onPress={()=> {
                    this.props.navigator.push({
                        component:SearchPage,
                        params:{
                            ...this.props
                        }
                    })
                }}>
                <View style={{padding:5,marginRight:8}}>
                    <Image
                        style={{width:24,height:24}}
                        source={require('../../../res/images/ic_search_white_48pt.png')}
                    />
                </View>

            </TouchableOpacity>
            {ViewUtils.getMoreButton(()=>this.refs.moreMenu.open())}
        </View>
    }

    renderMoreView(){
        let params={...this.props,fromPage:FLAG_TAB.flag_popularTab};
        return <MoreMenu
            ref="moreMenu"
            {...params}
            menus={[MORE_MENU.Custom_Key,MORE_MENU.Sort_Key,MORE_MENU.Remove_Key,MORE_MENU.Share,MORE_MENU.Custom_Theme,
                MORE_MENU.About_Author,MORE_MENU.About]}
            anchorView={()=>this.refs.moreMenuButton}
            onMoreMenuSelect={(e)=> {
                if (e === MORE_MENU.Custom_Theme) {
                    this.setState({
                        customThemeViewVisible:true
                    })
                }
            }}
        />
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
        let statusBar = {
            backgroundColor:this.state.theme.themeColor,
            barStyle:'light-content',
        };
        let content = this.state.languages.length > 0 ? <ScrollableTabView
            tabBarBackgroundColor={this.state.theme.themeColor}
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
            <NavigationBar
                title={'最热'}
                leftButton={<View/>}
                rightButton={this.renderRightButton()}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}/>
            {content}
            {this.renderMoreView()}
            {this.renderCustomThemeView()}
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },

});
