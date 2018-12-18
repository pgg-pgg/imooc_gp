import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    WebView,
    TouchableOpacity,
    Image,

} from 'react-native'
import NavigationBar from "../../common/NavigationBar";
import ViewUtils from "../../util/ViewUtils";
import FavoriteDao from "../../expand/dao/FavoriteDao";
import share from "../../../res/data/share";
import UShare from "../../common/UShare";
import BackPressComponent from "../../common/BackPressComponent";

const TRENDING_URL = 'https://github.com/';
export default class DescPage extends Component {
    constructor(props) {
        super(props);
        // alert(this.props.title);
        this.backPress = new BackPressComponent({backPress:(e)=>this.onBackPress(e)});
        this.url = this.props.projectModel.item.html_url ? this.props.projectModel.item.html_url : TRENDING_URL + this.props.projectModel.item.fullName;
        let title = this.props.projectModel.item.full_name ? this.props.projectModel.item.full_name : this.props.projectModel.item.fullName;
        this.favoriteDao = new FavoriteDao(this.props.flag);
        this.state = {
            url: this.url,
            title: title,
            canGoBack: false,
            isFavorite: this.props.projectModel.isFavorite,
            favoriteIcon: this.props.projectModel.isFavorite ? require('../../../res/images/ic_star.png')
                : require('../../../res/images/ic_star_navbar.png'),
            theme: this.props.theme,
        }
    }
    componentDidMount(): void {
        this.backPress.componentDidMount();
    }

    componentWillUnmount(): void {
        this.backPress.componentWillUnmount();
        if (this.props.onUpdateFavorite)this.props.onUpdateFavorite();
    }

    onBack() {
        if (this.state.canGoBack) {
            this.webView.goBack()
        } else {
            this.props.navigator.pop();
        }

    }

    onBackPress(e){
        this.onBack();
        return true;
    }

    go() {
        this.setState({
            url: this.text
        })
    }

    onNavigationStateChange(e) {
        this.setState({
            canGoBack: e.canGoBack,
            url: e.url,
        })
    }

    onRightButtonClick() {
        let projectModel = this.props.projectModel;
        this.setFavoriteState(projectModel.isFavorite = !projectModel.isFavorite);
        const key = projectModel.item.fullName ? projectModel.item.fullName : projectModel.item.id.toString();
        if (projectModel.isFavorite) {
            this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item))
        } else {
            this.favoriteDao.removeFavoriteItem(key)
        }
    }

    setFavoriteState(isFavorite) {
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ? require('../../../res/images/ic_star.png')
                : require('../../../res/images/ic_star_navbar.png')
        })
    }

    renderRightButton() {
        return <View style={{flexDirection: 'row'}}>
            {ViewUtils.getShareButton(()=>this.shareInfo())}
            <TouchableOpacity onPress={() => this.onRightButtonClick()}>
                <Image style={{width: 20, height: 20, marginRight: 10}} source={this.state.favoriteIcon}/>
            </TouchableOpacity>
        </View>
    }

    shareInfo(){
        const shareApp = share.share_app;
        UShare.share(shareApp.title, shareApp.content,
            shareApp.imgUrl,shareApp.url,()=>{},()=>{});
    }

    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor
        };
        let titleLayoutStyle = this.state.title.length>20?{paddingRight: 30}:null;
        return <View style={styles.container}>
            <NavigationBar
                title={this.state.title}
                statusBar={statusBar}
                titleLayoutStyle={titleLayoutStyle}
                style={this.state.theme.styles.navBar}
                rightButton={this.renderRightButton()}
                leftButton={ViewUtils.getLeftButton(() => this.onBack())}
            />
            <WebView ref={webView => this.webView = webView}
                     source={{uri: this.state.url}}
                     startInLoadingState={true}
                     onNavigationStateChange={(e) =>
                         this.onNavigationStateChange(e)}>
            </WebView>
        </View>
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tips: {
        fontSize: 20
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10
    },
    input: {
        height: 40,
        flex: 1,
        borderWidth: 1,
        margin: 2,
    }
});
