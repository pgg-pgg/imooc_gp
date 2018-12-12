import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ListView,
    RefreshControl,
    DeviceEventEmitter,
} from 'react-native';
import NavigationBar from "../../common/NavigationBar"
import {FLAG_STORAGE} from "../../expand/dao/DataRepository"
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import RepositoryCell from "../../common/RepositoryCell";
import DescPage from "../popular/DescPage";
import ProjectModel from "../../model/ProjectModel";
import FavoriteDao from "../../expand/dao/FavoriteDao";
import TrendingCell from "../../common/TrendingCell";
import ArrayUtils from "../../util/ArrayUtils";
export default class FavoritePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        let content = <ScrollableTabView
            tabBarBackgroundColor='#2196f3'
            tabBarActiveTextColor='#fff'
            tabBarInactiveTextColor='#333'
            tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
            renderTabBar={() => <ScrollableTabBar/>}
        >
            <FavoriteTab tabLabel='最热' flag={FLAG_STORAGE.flag_popular} {...this.props}/>
            <FavoriteTab tabLabel='趋势' flag={FLAG_STORAGE.flag_trending} {...this.props}/>
        </ScrollableTabView>
        return <View style={styles.container}>
            <NavigationBar title={'收藏'} statusBar={{backgroundColor: '#2196f3'}} style={{backgroundColor: '#2196f3'}}/>
            {content}
        </View>
    }
}

class FavoriteTab extends Component {
    constructor(props) {
        super(props);
        this.unFavoriteItems=[];
        this.favoriteDao = new FavoriteDao(this.props.flag);
        this.state = {
            result: '',
            isLoading: false,
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            favoriteKeys :[]
        }
    }

    componentDidMount(): void {
        this.onLoad(true)
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        this.onLoad(false)
    }

    updateState(dic){
        if (!this) return;
        this.setState(dic);
    }

    getDataSource(data){
        return this.state.dataSource.cloneWithRows(data);
    }

    onLoad(isShowLoading) {
        if (isShowLoading) {
            this.updateState({
                isLoading: true
            });
        }
        this.favoriteDao.getAllItems()
            .then(items=>{
                let resultData = [];
                for(let i =0,len=items.length;i<len;i++){
                    resultData.push(new ProjectModel(items[i],true));
                }
                this.updateState({
                    isLoading:false,
                    dataSource: this.getDataSource(resultData)
                })
            })
            .catch(e=>{
                this.updateState({
                    isLoading:false
                })
            })
    }
    onSelect(projectModel){
        var route ={
            component:DescPage,
            params:{
                flag: FLAG_STORAGE.flag_popular,
                ...this.props,
                projectModel: projectModel,

            }
        };
        this.props.navigator.push(route)
    }

    /**
     * favoriteIcon单击回调函数
     * @param item
     * @param isFavorite
     */
    onFavorite(item,isFavorite){
        const key = this.props.flag===FLAG_STORAGE.flag_popular ? item.id.toString() : item.fullName;
        if (isFavorite) {
            this.favoriteDao.saveFavoriteItem(key,JSON.stringify(item))
        }else {
            this.favoriteDao.removeFavoriteItem(key)
        }
        ArrayUtils.updateArray(this.unFavoriteItems,item);
        if (this.unFavoriteItems.length > 0) {
            if (this.props.flag === FLAG_STORAGE.flag_popular) {
                DeviceEventEmitter.emit('favoriteChanged_popular');
            }else {
                DeviceEventEmitter.emit('favoriteChanged_trending')
            }
        }
    }

    choose(projectModel) {
        let CellComponent = this.props.flag===FLAG_STORAGE.flag_popular?RepositoryCell:TrendingCell;
        return <CellComponent
            onSelect={()=>this.onSelect(projectModel)}
            key={this.props.flag===FLAG_STORAGE.flag_popular?projectModel.item.id:projectModel.item.fullName}
            onFavorite={(item,isFavorite)=>this.onFavorite(item,isFavorite)}
            projectModel={projectModel}/>
    }

    render() {
        return <View style={styles.container}>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(data) => this.choose(data)}
                enableEmptySections={true}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={() => this.onLoad()}
                        color={['#2196f3']}
                        tintColor={'#2196f3'}
                        title={'Loading...'}
                        titleColor={'#2196f3'}
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
