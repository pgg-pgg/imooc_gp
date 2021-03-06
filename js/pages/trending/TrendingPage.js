import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Image,
    Text,
    View,
    TextInput,
    ListView,
    RefreshControl,
    DeviceEventEmitter,
    TouchableOpacity,
} from 'react-native';
import NavigationBar from "../../common/NavigationBar"
import DataRepository, {FLAG_STORAGE} from "../../expand/dao/DataRepository"
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import RepositoryCell from "../../common/RepositoryCell";
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
import DescPage from "../popular/DescPage";
import TrendingCell from "../../common/TrendingCell";
import TimeSpan from "../../model/TimeSpan";
import Popover from "../../common/Popover";
import FavoriteDao from "../../expand/dao/FavoriteDao";
import ProjectModel from "../../model/ProjectModel";
import Utils from "../../util/Utils";
import ActionUtils from "../../util/ActionUtils";
import {FLAG_TAB} from "../HomePage";
import MoreMenu, {MORE_MENU} from "../../common/MoreMenu";
import ViewUtils from "../../util/ViewUtils";
import BaseComponent from "../BaseComponent";
import CustomTheme from "../My/CustomTheme";

const API_URL = "https://github.com/trending/";
var timeSpanTextArray = [new TimeSpan('今 天', 'since=daily'), new TimeSpan('本 周', 'since=weekly'), new TimeSpan('本 月', 'since=monthly')];
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);
var dataRespository = new DataRepository(FLAG_STORAGE.flag_trending);


export default class TrendingPage extends BaseComponent {

    constructor(props) {
        super(props);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language);
        this.state = {
            languages: [],
            isVisible: false,
            buttonRect: {},
            timeSpan: timeSpanTextArray[0],
            theme:this.props.theme,
            customThemeViewVisible: false,
        }
    }

    componentDidMount() {
        super.componentDidMount();
        this.loadData();
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        if (nextProps.timeSpan !== this.props.timeSpan) {
            this.loadData(nextProps.timeSpan)
        }
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

    showPopover() {
        this.refs.button.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isVisible: true,
                buttonRect: {x: px, y: py, width: width, height: height}
            });
        });
    }

    closePopover() {
        this.setState({
            isVisible: false,
        });
    }

    renderTitleView() {
        return <View>
            <TouchableOpacity ref={'button'} onPress={() => {
                this.showPopover()
            }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{
                        fontSize: 18,
                        color: 'white',
                        fontWeight: '400'
                    }}>趋势 {this.state.timeSpan.showText}</Text>
                    <Image style={{width: 12, height: 12, marginLeft: 5}}
                           source={require('../../../res/images/ic_spinner_triangle.png')}/>
                </View>
            </TouchableOpacity>
        </View>
    }

    onSelectTimeSpan(timeSpan) {
        this.setState({
            timeSpan: timeSpan,
            isVisible: false,
        })
    }

    renderMoreView() {
        let params = {...this.props, fromPage: FLAG_TAB.flag_popularTab};
        return <MoreMenu
            ref="moreMenu"
            {...params}
            menus={[MORE_MENU.Custom_Language, MORE_MENU.Sort_Language,MORE_MENU.Share, MORE_MENU.Custom_Theme,
                MORE_MENU.About_Author, MORE_MENU.About]}
            anchorView={() => this.refs.moreMenuButton}
            onMoreMenuSelect={(e) => {
                if (e === MORE_MENU.Custom_Theme) {
                    this.setState({
                        customThemeViewVisible: true
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
            backgroundColor:this.state.theme.themeColor
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
                    <TrendingTab key={i} tabLabel={lan.name}
                                 timeSpan={this.state.timeSpan} {...this.props}>{lan.name}</TrendingTab> : null;
            })}
        </ScrollableTabView> : null;
        let timeSpanView = <Popover
            isVisible={this.state.isVisible}
            fromRect={this.state.buttonRect}
            placement={'bottom'}
            contentStyle={{backgroundColor: '#343434', opacity: 0.5}}
            onClose={() => this.closePopover()}>
            {timeSpanTextArray.map((result, i, arr) => {
                return <TouchableOpacity key={i} underlayColor={'transparent'}
                                         onPress={() => this.onSelectTimeSpan(arr[i])}>
                    <Text style={{fontSize: 18, color: 'white', padding: 8, fontWeight: '400'}}>{arr[i].showText}</Text>
                </TouchableOpacity>
            })}
        </Popover>;
        return <View style={styles.container}>
            <NavigationBar
                titleView={this.renderTitleView()}
                leftButton={<View/>}
                rightButton={ViewUtils.getMoreButton(() => this.refs.moreMenu.open())}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}/>
            {content}
            {timeSpanView}
            {this.renderMoreView()}
            {this.renderCustomThemeView()}
        </View>
    }
}

class TrendingTab extends Component {
    constructor(props) {
        super(props);
        this.isFavoriteChange = false;
        this.state = {
            result: '',
            isLoading: false,
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            favoriteKeys: [],
            theme:this.props.theme,
        }
    }


    /**
     * 更新project item收藏状态
     */
    flushFavoriteState() {
        let projectModels = [];
        let items = this.items;
        for (let i = 0, len = items.length; i < len; i++) {
            projectModels.push(new ProjectModel(items[i], Utils.checkFavorite(items[i], this.state.favoriteKeys)))
        }
        this.updateState({
            isLoading: false,
            dataSource: this.getDataSource(projectModels),
        })
    }

    getDataSource(data) {
        return this.state.dataSource.cloneWithRows(data);
    }

    getFavoriteKeys() {
        favoriteDao.getFavoriteKeys()
            .then(keys => {
                if (keys) {
                    this.updateState({
                        favoriteKeys: keys
                    })
                }
                this.flushFavoriteState();
            })
            .catch(e => {
                this.flushFavoriteState()
            })
    }

    updateState(dic) {
        if (!this) return;
        this.setState(dic);
    }

    componentDidMount(): void {
        this.onLoad(this.props.timeSpan, true)
        this.listener = DeviceEventEmitter.addListener('favoriteChanged_trending', () => {
            this.isFavoriteChange = true;
        })
    }

    onUpdateFavorite() {
        this.getFavoriteKeys();
    }

    componentWillUnmount(): void {
        if (this.listener) {
            this.listener.remove();
        }
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        if (this.isFavoriteChange) {
            this.isFavoriteChange = false;
            this.getFavoriteKeys()
        }else if (nextProps.theme !== this.state.theme) {
            this.updateState({
                theme:nextProps.theme,
            });
            this.flushFavoriteState()
        }
    }

    getFetchUrl(timeSpan, category) {
        return API_URL + category + '?' + timeSpan.searchText
    }

    onLoad(timeSpan, isRefresh) {
        this.updateState({
            isLoading: true
        });

        let url = this.getFetchUrl(timeSpan, this.props.tabLabel)
        dataRespository.fetchRepository(url)
            .then(result => {
                this.items = result && result.items ? result.items : result ? result : [];
                this.getFavoriteKeys();
                if (!this.items || isRefresh && result && result.update_date && !dataRespository.checkData(result.update_date)) {
                    return dataRespository.fetchNetRepository(url)
                }
            })
            .then(items => {
                if (!items || items.length === 0) {
                    return;
                } else {
                    this.items = items;
                    this.getFavoriteKeys();
                }
            })
            .catch(error => {
                this.updateState({
                    isLoading: false
                })
            });
    }


    choose(projectModel) {
        return <TrendingCell
            onSelect={() => ActionUtils.onSelectRepository({
                projectModel: projectModel,
                flag: FLAG_STORAGE.flag_trending,
                ...this.props,
                parentComponent: this,
                onUpdateFavorite: ()=>this.onUpdateFavorite(),
            })}
            theme={this.props.theme}
            key={projectModel.item.fullName}
            onFavorite={(item, isFavorite) => ActionUtils.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)}
            projectModel={projectModel}/>
    }

    onRefresh() {
        this.onLoad(this.props.timeSpan, true);
    }


    render() {
        return <View style={styles.container}>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(data) => this.choose(data)}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={() => this.onRefresh()}
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
