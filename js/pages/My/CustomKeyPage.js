import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Image,
    Text,
    View,
    ScrollView, Alert,DeviceEventEmitter,
} from 'react-native';
import NavigationBar from "../../common/NavigationBar";
import ViewUtils from "../../util/ViewUtils";
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
import CheckBox from "react-native-check-box"
import ArrayUtils from "../../util/ArrayUtils";
import {ACTION_HOME, FLAG_TAB} from "../HomePage";
import BackPressComponent from "../../common/BackPressComponent";

export default class CustomKeyPage extends Component {
    constructor(props) {
        super(props);
        this.backPress = new BackPressComponent({backPress:(e)=>this.onBackPress(e)});
        this.languageDao = new LanguageDao(this.props.flag);
        this.isRemoveKey = !!this.props.isRemoveKey;
        this.changeValues = [];
        this.state = {
            dataArray: [],
            theme:this.props.theme,
        }
    }

    componentDidMount(): void {
        this.loadData();
        this.backPress.componentDidMount();
    }

    componentWillUnmount(): void {
        this.backPress.componentWillUnmount();
    }

    onBackPress(e){
        this.onBack();
        return true;
    }


    loadData() {
        this.languageDao.fetch()
            .then(result => {
                this.setState({
                    dataArray: result
                })
            }).catch(error => {
            console.log(error)
        })
    }

    onSave() {
        if (this.changeValues.length === 0) {
            this.props.navigator.pop();
            return;
        }
        if(this.isRemoveKey){
            for(let i=0,l=this.changeValues.length;i<l;i++){
                ArrayUtils.remove(this.state.dataArray,this.changeValues[i]);
            }
        }
        this.languageDao.save(this.state.dataArray);
        let jumpToTab = this.props.flag === FLAG_LANGUAGE.flag_key?FLAG_TAB.flag_popularTab:FLAG_TAB.flag_trendingTab;
        DeviceEventEmitter.emit('ACTION_HOME',ACTION_HOME.A_RESTART,jumpToTab)
    }


    onBack() {
        if (this.changeValues.length > 0) {
            Alert.alert(
                '提示',
                '要保存修改吗?',
                [
                    {
                        text: '否', onPress: () => {
                            this.props.navigator.pop();
                        }
                    }, {
                    text: '是', onPress: () => {
                        this.onSave();
                    }
                }
                ]
            )
        } else {
            this.props.navigator.pop();
        }
    }

    renderView() {
        if (!this.state.dataArray || this.state.dataArray.length === 0)
            return;
        let len = this.state.dataArray.length;
        let views = [];
        for (let i = 0, l = len - 2; i < l; i += 2) {
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(this.state.dataArray[i])}
                        {this.renderCheckBox(this.state.dataArray[i + 1])}

                    </View>
                    <View style={styles.line}/>
                </View>
            )
        }
        views.push(
            <View key={len - 1}>
                <View style={styles.item}>
                    {len % 2 === 0 ? this.renderCheckBox(this.state.dataArray[len - 2]) : null}
                    {this.renderCheckBox(this.state.dataArray[len - 1])}
                </View>
                <View style={styles.line}/>
            </View>
        );
        return views;
    }

    onCheckClick(data) {
        if (!this.isRemoveKey) data.checked = !data.checked;
        ArrayUtils.updateArray(this.changeValues, data);
    }

    renderCheckBox(data) {
        let leftText = data.name;
        let isChecked = this.isRemoveKey ? false : data.checked;
        return (
            <CheckBox
                onClick={() => this.onCheckClick(data)}
                style={{flex: 1, padding: 10}}
                leftText={leftText}
                isChecked={isChecked}
                checkedImage={<Image style={this.state.theme.styles.tabBarSelectedIcon} source={require('./img/ic_check_box.png')}/>}
                unCheckedImage={<Image style={this.state.theme.styles.tabBarSelectedIcon}
                                       source={require('./img/ic_check_box_outline_blank.png')}/>}
            />
        )
    }

    render() {
        let statusBar = {
            backgroundColor:this.state.theme.themeColor
        };
        let rightButtonTitle = this.isRemoveKey?'移除':'保存';
        let title = this.isRemoveKey ? '标签移除' : '自定义标签';
        title = this.props.flag===FLAG_LANGUAGE.flag_language?'自定义语言':title;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={title}
                    statusBar={statusBar}
                    style={this.state.theme.styles.navBar}
                    leftButton={ViewUtils.getLeftButton(() => this.onBack())}
                    rightButton={ViewUtils.getRightButton(rightButtonTitle,()=>{this.onSave()})}
                />
                <ScrollView>
                    {this.renderView()}
                </ScrollView>
            </View>
        )
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    page1: {
        flex: 1,
    },
    page2: {
        flex: 2,
        backgroundColor: 'green'
    },
    image: {
        width: 22,
        height: 22
    },
    tips: {
        fontSize: 20,
        color: 'black',
        margin: 10
    },
    title: {
        fontSize: 20,
        color: 'white',
    },
    line: {
        flex: 1,
        height: 0.3,
        backgroundColor: 'darkgray',
    },
    item: {
        flexDirection: 'row'
    }
});
