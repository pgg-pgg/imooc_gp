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
import ActionUtils from "../../util/ActionUtils";
import MoreMenu, {MORE_MENU} from "../../common/MoreMenu";
import {FLAG_TAB} from "../HomePage";
import ViewUtils from "../../util/ViewUtils";
import BaseComponent from "../BaseComponent";
import CustomTheme from "../My/CustomTheme";

export default class FavoritePage extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
            customThemeViewVisible: false,
        }
    }

    renderMoreView() {
        let params = {...this.props, fromPage: FLAG_TAB.flag_popularTab}
        return <MoreMenu
            ref="moreMenu"
            {...params}
            menus={[MORE_MENU.Custom_Theme, MORE_MENU.Share,
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
            backgroundColor: this.state.theme.themeColor
        };
        let content = <ScrollableTabView
            tabBarBackgroundColor={this.state.theme.themeColor}
            tabBarActiveTextColor='#fff'
            tabBarInactiveTextColor='#333'
            tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
            renderTabBar={() => <ScrollableTabBar/>}
        >
            <FavoriteTab tabLabel='最热' flag={FLAG_STORAGE.flag_popular} {...this.props}/>
            <FavoriteTab tabLabel='趋势' flag={FLAG_STORAGE.flag_trending} {...this.props}/>
        </ScrollableTabView>
        return <View style={styles.container}>
            <NavigationBar
                title={'收藏'}
                leftButton={<View/>}
                rightButton={ViewUtils.getMoreButton(() => this.refs.moreMenu.open())}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}/>
            {content}
            {this.renderMoreView()}
            {this.renderCustomThemeView()}
        </View>
    }
}

class FavoriteTab extends Component {
    constructor(props) {
        super(props);
        this.unFavoriteItems = [];
        this.favoriteDao = new FavoriteDao(this.props.flag);
        this.state = {
            result: '',
            isLoading: false,
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            favoriteKeys: [],
            theme: this.props.theme,
        }
    }

    componentDidMount(): void {
        this.onLoad(true)
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        this.onLoad(false)
    }

    updateState(dic) {
        if (!this) return;
        this.setState(dic);
    }

    getDataSource(data) {
        return this.state.dataSource.cloneWithRows(data);
    }

    onLoad(isShowLoading) {
        if (isShowLoading) {
            this.updateState({
                isLoading: true
            });
        }
        this.favoriteDao.getAllItems()
            .then(items => {
                let resultData = [];
                for (let i = 0, len = items.length; i < len; i++) {
                    resultData.push(new ProjectModel(items[i], true));
                }
                this.updateState({
                    isLoading: false,
                    dataSource: this.getDataSource(resultData)
                })
            })
            .catch(e => {
                this.updateState({
                    isLoading: false
                })
            })
    }

    choose(projectModel) {
        let CellComponent = this.props.flag === FLAG_STORAGE.flag_popular ? RepositoryCell : TrendingCell;
        return <CellComponent
            onSelect={() => ActionUtils.onSelectRepository({
                flag: FLAG_STORAGE.flag_popular,
                ...this.props,
                projectModel: projectModel,
            })}
            theme={this.props.theme}
            key={this.props.flag === FLAG_STORAGE.flag_popular ? projectModel.item.id : projectModel.item.fullName}
            onFavorite={(item, isFavorite) => ActionUtils.onFavorite(this.favoriteDao, item, isFavorite, this.props.flag)}
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
