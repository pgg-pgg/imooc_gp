import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity, Image, TouchableHighlight,
    Alert, DeviceEventEmitter,
} from 'react-native';
import NavigationBar from "../../common/NavigationBar";
import CustomKeyPage from "./CustomKeyPage";
import {FLAG_LANGUAGE} from "../../expand/dao/LanguageDao";
import LanguageDao from "../../expand/dao/LanguageDao";
import ArrayUtils from "../../util/ArrayUtils";
import SortableListView from "react-native-sortable-listview"
import ViewUtils from "../../util/ViewUtils";
import {ACTION_HOME, FLAG_TAB} from "../HomePage";

export default class SortKeyPage extends Component {
    constructor(props) {
        super(props)
        this.dataArray = [];
        this.sortResultArray = [];
        this.originalCheckedArray = [];
        this.state = ({
            checkedArray: []
        })
    }

    componentDidMount() {
        this.languageDao = new LanguageDao(this.props.flag);
        this.loadData()
    }

    loadData() {
        this.languageDao.fetch()
            .then(result => {
                this.getCheckedItems(result);
            })
            .catch(error => {

            })
    }

    getCheckedItems(result) {
        this.dataArray = result;
        let checkedArray = [];
        for (let i = 0, len = result.length; i < len; i++) {
            let data = result[i];
            if (data.checked) checkedArray.push(data);
        }
        this.setState({
            checkedArray: checkedArray,

        });
        this.originalCheckedArray = ArrayUtils.clone(checkedArray);
    }

    onBack() {
        if (ArrayUtils.isEqual(this.originalCheckedArray, this.state.checkedArray)) {
            this.props.navigator.pop()
            return;
        }
        Alert.alert('提示', '是否保存修改？',
            [
                {
                    text: '否', onPress: () => {
                        this.props.navigator.pop()
                    }
                },
                {
                    text: '是', onPress: () => {
                        this.onSave(true)
                    }
                }
            ])

    }

    onSave() {
        if (ArrayUtils.isEqual(this.originalCheckedArray, this.state.checkedArray)) {
            return;
        } else {
            this.getSortResult();
            this.languageDao.save(this.sortResultArray);

        }
        let jumpToTab = this.props.flag === FLAG_LANGUAGE.flag_key?FLAG_TAB.flag_popularTab:FLAG_TAB.flag_trendingTab
        DeviceEventEmitter.emit('ACTION_HOME',ACTION_HOME.A_RESTART,jumpToTab)
    }

    getSortResult() {
        this.sortResultArray = ArrayUtils.clone(this.dataArray);
        for (let i = 0, l = this.originalCheckedArray.length; i < l; i++) {
            let item = this.originalCheckedArray[i]
            let index = this.dataArray.indexOf(item)
            this.sortResultArray.splice(index, 1, this.state.checkedArray[i]);
        }
    }

    render() {
        let title = this.props.flag===FLAG_LANGUAGE.flag_language?'语言排序':'标签排序';
        return <View style={styles.container}>
            <NavigationBar title={title}
                           statusBar={{backgroundColor: '#2196f3'}}
                           leftButton={ViewUtils.getLeftButton(() => this.onBack())}
                           rightButton={ViewUtils.getRightButton('保存', () => this.onSave())}
                           style={{backgroundColor: '#2196f3'}}/>
            <SortableListView
                style={{flex: 1}}
                data={this.state.checkedArray}
                order={Object.keys(this.state.checkedArray)}
                onRowMoved={e => {
                    this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0]);
                    this.forceUpdate();
                }}
                renderRow={row => <SortCell data={row}/>}
            />

        </View>
    }
}

class SortCell extends Component {
    render() {
        return (<TouchableHighlight
            underlayColor={'#eee'}
            style={this.props.data.checked ? styles.item : styles.hidden}
            {...this.props.sortHandlers}>
            <View style={{marginLeft: 10, flexDirection: 'row'}}>
                <Image source={require('./img/ic_sort.png')} resizeMode='stretch' style={[{
                    opacity: 1,
                    width: 16,
                    height: 16,
                    marginRight: 10,
                },]}/>
                <Text>{this.props.data.name}</Text>
            </View>
        </TouchableHighlight>)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    hidden: {
        height: 0
    },
    item: {
        backgroundColor: "#F8F8F8",
        borderBottomWidth: 1,
        borderColor: '#eee',
        height: 50,
        justifyContent: 'center'
    },
    line: {
        flex: 1,
        height: 0.3,
        backgroundColor: 'darkgray',
    },
});
