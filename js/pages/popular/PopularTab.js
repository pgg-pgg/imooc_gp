import React, {Component} from 'react';
import {DeviceEventEmitter, ListView, RefreshControl, StyleSheet, View} from "react-native";
import ProjectModel from "../../model/ProjectModel";
import Utils from "../../util/Utils";
import DescPage from "./DescPage";
import {FLAG_STORAGE} from "../../expand/dao/DataRepository";
import RepositoryCell from "../../common/RepositoryCell";
import FavoriteDao from "../../expand/dao/FavoriteDao";
import DataRepository from "../../expand/dao/DataRepository";
import ActionUtils from "../../util/ActionUtils";

const URL = "https://api.github.com/search/repositories?q=";
const QUERY_STR = '&sort=stars';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
const dataRepository = new DataRepository(FLAG_STORAGE.flag_popular);

export default class PopularTab extends Component {
    constructor(props) {
        super(props);
        this.isFavoriteChange=false;
        this.state = {
            result: '',
            isLoading: false,
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            favoriteKeys :[],
            theme:this.props.theme,
        }
    }

    componentDidMount(): void {
        this.onLoad();
        this.listener= DeviceEventEmitter.addListener('favoriteChanged_popular',()=>{
            this.isFavoriteChange = true;
        })
    }

    componentWillUnmount(): void {
        if (this.listener){
            this.listener.remove();
        }
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        if (this.isFavoriteChange) {
            this.isFavoriteChange=false;
            this.getFavoriteKeys()
        }else if (nextProps.theme !== this.state.theme) {
            this.updateState({
                theme:nextProps.theme,
            })
            this.flushFavoriteState()
        }
    }


    /**
     * 更新project item收藏状态
     */
    flushFavoriteState(){
        let projectModels = [];
        let items = this.items;
        for(let i =0 ,len = items.length;i<len;i++){
            projectModels.push(new ProjectModel(items[i],Utils.checkFavorite(items[i],this.state.favoriteKeys)))
        }
        this.updateState({
            isLoading:false,
            dataSource:this.getDataSource(projectModels),
        })
    }


    getDataSource(data){
        return this.state.dataSource.cloneWithRows(data);
    }

    getFavoriteKeys(){
        favoriteDao.getFavoriteKeys()
            .then(keys=>{
                if (keys) {
                    this.updateState({
                        favoriteKeys: keys
                    })
                }
                this.flushFavoriteState();
            })
            .catch(e=>{
                this.flushFavoriteState()
            })
    }

    updateState(dic){
        if (!this) return;
        this.setState(dic);
    }

    onLoad() {
        this.updateState({
            isLoading: true
        });
        let url = URL + this.props.tabLabel + QUERY_STR;
        dataRepository.fetchRepository(url)
            .then(result => {
                this.items = result && result.items ? result.items : result ? result : [];
                this.getFavoriteKeys();
                if (!this.items||result && result.update_date && !dataRepository.checkData(result.update_date)) {
                    return dataRepository.fetchNetRepository(url)
                }
            })
            .then(items => {
                if (!items || items.length === 0) {
                    return;
                } else {
                    this.items=items;
                    this.getFavoriteKeys()
                }
            })
            .catch(error => {
                console.log(error);
                this.updateState({
                    isLoading:false,
                })
            });
    }

    choose(projectModel) {
        return <RepositoryCell
            onSelect={()=>ActionUtils.onSelectRepository({
                flag: FLAG_STORAGE.flag_popular,
                ...this.props,
                projectModel: projectModel,
            })}
            theme={this.state.theme}
            key={projectModel.item.id}
            onFavorite={(item,isFavorite)=>ActionUtils.onFavorite(favoriteDao,item, isFavorite)}
            projectModel={projectModel}/>
    }

    render() {
        return <View style={styles.container}>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(data) => this.choose(data)}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={() => this.onLoad()}
                        color={this.state.theme.themeColor}
                        tintColor={this.state.theme.themeColor}
                        title={'Loading...'}
                        titleColor={this.state.theme.themeColor}
                    />
                }

            />
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
