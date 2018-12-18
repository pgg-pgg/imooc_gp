import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Platform, Text,
    TextInput, TouchableOpacity,
    ListView,ActivityIndicator,DeviceEventEmitter,
} from 'react-native';
import ViewUtils from "../util/ViewUtils";
import GlobalStyles from "../../res/styles/GlobalStyles";
import Toast, {DURATION} from 'react-native-easy-toast'
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataRepository";
import ProjectModel from "../model/ProjectModel";
import Utils from "../util/Utils";
import RepositoryCell from "../common/RepositoryCell";
import ActionUtils from "../util/ActionUtils";
import LanguageDao, {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import {ACTION_HOME} from "./HomePage";
import makeCancelable from "../util/Cancleable";
import BackPressComponent from "../common/BackPressComponent";

const URL = "https://api.github.com/search/repositories?q=";
const QUERY_STR = '&sort=stars';
export default class SearchPage extends Component {

    constructor(props) {
        super(props);
        this.backPress = new BackPressComponent({backPress:(e)=>this.onBackPress(e)});
        this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
        this.favoriteKeys = [];
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.keys = [];
        this.isKeyChange = false;
        this.state = {
            rightButtonText: '搜索',
            showBottomButton:false,
            isLoading: false,
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            theme:this.props.theme,
        }
    }


    componentDidMount(): void {
        this.initKeys();
        this.backPress.componentDidMount();
    }

    componentWillUnmount(): void {
        if (this.isKeyChange){
            DeviceEventEmitter.emit('ACTION_HOME',
                ACTION_HOME.A_RESTART)
        }
        this.cancelable&&this.cancelable.cancel();
        this.backPress.componentWillUnmount();
    }

    async initKeys(){
        this.keys = await this.languageDao.fetch()
    }

    /**
     * 检查标签是否存在
     * @param keys
     * @param key
     */
    checkKeyExist(keys,key){
        for (let i =0,l=keys.length;i<l;i++) {
            if (key.toLowerCase() === keys[i].name.toLowerCase()) return true;
        }
        return false;
    }

    /**
     * 保存标签
     */
    saveKey(){
        let key = this.text;
        if (this.checkKeyExist(this.keys,key)){
            this.toast.show(key+'已经存在',DURATION.LENGTH_SHORT);
        }else {
            key = {
                "path":key,
                "name":key,
                "checked":true
            };
            this.keys.unshift(key);
            this.languageDao.save(this.keys);
            this.toast.show(key.name+'保存成功',DURATION.LENGTH_SHORT);
            this.isKeyChange=true;
        }
    }



    getFetchURL(key) {
        return URL + key + QUERY_STR;
    }

    loadData() {
        this.updateState({isLoading: true,showBottomButton:false,});
        this.cancelable = makeCancelable(fetch(this.getFetchURL(this.text)));
        this.cancelable.promise
        .then(
            response => response.json())
            .then(responseData => {
                if (!this || !responseData || !responseData.items || responseData.items.length === 0) {
                    this.toast.show(this.text + '什么也没找到', DURATION.LENGTH_SHORT);
                    this.updateState({isLoading: false, rightButtonText: '搜索'});
                    return;
                }
                this.items = responseData.items;
                this.getFavoriteKeys();
                if (!this.checkKeyExist(this.keys,this.text)) {
                    this.updateState({showBottomButton:true})
                }
            }).catch(e => {
                this.updateState({
                    isLoading:false,
                    rightButtonText:'搜索',
                })
        })
    }

    getDataSource(data){
        return this.state.dataSource.cloneWithRows(data);
    }

    updateState(dic) {
        this.setState(dic);
    }

    onRightButtonClick() {
        if (this.state.rightButtonText === '搜索') {
            this.updateState({rightButtonText: '取消'});
            this.loadData();
        } else {
            this.updateState({rightButtonText: '搜索',isLoading:false});
            this.cancelable.cancel();
        }

    }


    getFavoriteKeys() {
        this.favoriteDao.getFavoriteKeys()
            .then(keys => {
                this.favoriteKeys = keys || [];
                this.flushFavoriteState();
            })
            .catch(e => {
                this.flushFavoriteState()
            })
    }

    /**
     * 更新project item收藏状态
     */
    flushFavoriteState() {
        let projectModels = [];
        let items = this.items;
        for (let i = 0, len = items.length; i < len; i++) {
            projectModels.push(new ProjectModel(items[i], Utils.checkFavorite(items[i], this.favoriteKeys)))
        }
        this.updateState({
            isLoading: false,
            dataSource: this.getDataSource(projectModels),
            rightButtonText: '搜索',
        })
    }

    renderNavBar() {
        let backButton = ViewUtils.getLeftButton(() => this.onBackPress());
        let inputView = <TextInput ref={'input'}
                                   style={styles.textInput}
                                   onChangeText={(text) => {
                                       this.text = text;
                                   }}/>;
        let rightButton = <TouchableOpacity onPress={() => {
            this.refs.input.blur();
            this.onRightButtonClick()
        }}>
            <View>
                <Text style={styles.title}>{this.state.rightButtonText}</Text>
            </View>

        </TouchableOpacity>;

        return <View style={{
            backgroundColor: this.state.theme.themeColor,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 8,
            height: Platform.OS === 'ios' ? GlobalStyles.nav_bar_height_ios : GlobalStyles.nav_bar_height_android
        }}>
            {backButton}
            {inputView}
            {rightButton}
        </View>
    }

    onBackPress() {
        this.refs.input.blur();
        this.props.navigator.pop();
        return true;
    }

    renderRow(projectModel) {
        return <RepositoryCell
            onSelect={()=>ActionUtils.onSelectRepository({
                flag: FLAG_STORAGE.flag_popular,
                ...this.props,
                projectModel: projectModel,
            })}
            theme={this.props.theme}
            key={projectModel.item.id}
            onFavorite={(item,isFavorite)=>ActionUtils.onFavorite(this.favoriteDao,item, isFavorite)}
            projectModel={projectModel}/>
    }


    render() {
        let statusBar = null;
        if (Platform.OS === 'ios') {
            statusBar = <View style={[styles.statusBar, {backgroundColor:this.state.theme.themeColor}]}/>
        }
        let listView =!this.state.isLoading? <ListView
            dataSource = {this.state.dataSource}
            renderRow={(data)=>this.renderRow(data)}

        />:null;
        let activityIndicator = this.state.isLoading?
            <ActivityIndicator size={'large'} color={this.state.theme.themeColor} style={styles.centering} animating={this.state.isLoading}/>:null;

        let resultView = <View style={{flex: 1}}>
            {activityIndicator}
            {listView}
        </View>;

        let bottomButton = this.state.showBottomButton?
            <TouchableOpacity
                onPress={()=>this.saveKey()}
                style={[styles.bottomButton,this.state.theme.themeColor]}>
                <View style={{justifyContent: 'center'}}>
                    <Text style={styles.title}>添加标签</Text>
                </View>
            </TouchableOpacity>:null;
        return <View style={GlobalStyles.root_container}>
            {statusBar}
            {this.renderNavBar()}
            {resultView}
            {bottomButton}
            <Toast ref={(toast) => {
                this.toast = toast
            }}/>
        </View>
    }
}


const styles = StyleSheet.create({
    statusBar: {
        height: 30,
    },
    textInput: {
        flex: 1,
        height: (Platform.OS === 'ios') ? 30 : 40,
        borderWidth: (Platform.OS === 'ios') ? 1 : 0,
        borderColor: 'white',
        alignSelf: 'center',
        paddingLeft: 5,
        marginRight: 10,
        paddingRight: 20,
        marginLeft: 5,
        borderRadius: 3,
        opacity: 0.7,
        color: 'white',
    },
    title: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500'

    },
    centering:{
        alignItems: 'center',
        justifyContent: 'center',
        flex:1,
    },
    bottomButton:{
        alignItems:'center',
        justifyContent:'center',
        opacity: 0.9,
        height:40,
        position:'absolute',
        left:10,
        top:GlobalStyles.window_height-50,
        right:10,
        borderRadius: 8
    }
});
