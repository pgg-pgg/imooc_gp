import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Image,
    Text,
    View, AsyncStorage,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    TouchableNativeFeedback,
    Alert,
    Modal,
    FlatList,
    Animated,
    Easing
} from 'react-native';
import NavigationBar from "./common/NavigationBar";
import ViewUtils from "./util/ViewUtils";

const data = [{title: '北京趣拿信息技术有限公司', num: '911010020939390483D'}, {
    title: '北京趣拿信息技术有限公司哈尔滨',
    num: '911010020939390483F'
}, {title: '北京趣拿信息技术有限公司武汉', num: '911010020939390483G'}];

export default class MobxTest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            isChoose: {
                isCom:true,
                isPeo:false,
                isGov:false
            },
            isModal: false,
            dataArray: data,
            com_name: '',
            offset:new Animated.Value(0),
        }
    }

    in() {
        // this.setState({ isModal: true })

        Animated.timing(

            this.state.offset,
            {
                easing: Easing.linear,
                duration: 500,
                toValue: 1
            }
        ).start()

    }

    out() {
        Animated.timing(
            this.state.offset,
            {
                easing: Easing.linear,
                duration: 500,
                toValue: 0
            }
        ).start()

        // setTimeout(
        //     () => this.setState({ isModal: false }),
        //     300
        // )
    }

    showModal() {
        this.setState({isModal: true});
        this.in()
    }

    disShowModal() {
        this.out();
        this.setState({isModal: false})
    }

    renderItems(title, placeholder, flag = false) {
        return <View style={{flexDirection: 'column'}}>
            <View style={styles.item}>
                <Text style={styles.title}>{title}</Text>
                <TextInput
                    multiline={false}
                    placeholder={placeholder}
                    placeholderTextColor={'#c4c4c4'}
                    iosclearButtonMode={true}
                    underlineColorAndroid="transparent"
                    style={styles.textInput}
                />

            </View>
            <View style={{height: 1, backgroundColor: '#fbfbfb', marginLeft: 20, marginRight: 20}}/>
        </View>
    }

    _keyExtractor = (item, index) => item.id;

    _renderItem(data, index) {
        return <TouchableOpacity key={index} onPress={() => {
            this.disShowModal()
            this.setState({
                com_name: data.item.title
            })
        }}>
            <View style={{flexDirection: 'column'}}>
                <Text style={styles.text_item_title}>{data.item.title}</Text>
                <Text style={styles.text_item_num}>{data.item.num}</Text>
            </View>
        </TouchableOpacity>
    }
    render() {
        let popupView = <Animated.View
            style={{position: 'absolute',  height: this.state.offset.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, (150)]
                }),}}>
            <View style={{
                position: 'absolute',
                width: 0,
                height: 0,
                borderTopWidth: 10,
                borderTopColor: 'transparent',
                borderRightWidth: 10,
                borderRightColor: 'transparent',
                borderLeftWidth: 10,
                borderLeftColor: 'transparent',
                borderBottomWidth: 10,
                left: 120,
                top: 145,
                borderBottomColor: '#ECEFF2',
            }}/>
            <View style={{
                backgroundColor: '#ECEFF2',
                justifyContent: 'center',
                alignItems: 'center',
                left: 100,
                top: 165,
            }}>
                <FlatList data={this.state.dataArray}
                          renderItem={(data, index) => this._renderItem(data, index)}
                          keyExtractor={this._keyExtractor}
                          keyboardShouldPersistTaps={'always'}

                />
            </View>
        </Animated.View>
        return (
            <View style={styles.container}>
                <NavigationBar
                    statusBar={{backgroundColor: '#52B8CF'}}
                    style={{backgroundColor: '#52B8CF'}}
                    title={this.state.title === '' ? '添加发票' : this.state.title}
                    leftButton={ViewUtils.getLeftButton(() => {
                    })}
                />
                <View style={styles.info}>
                    <View style={styles.options_out}>
                        <View style={styles.options}>
                            <Text
                                style={this.state.isChoose.isCom ? styles.options_text_choose : styles.options_text_unchoose}
                                onPress={() => {
                                    this.setState({
                                        isChoose:{isCom: !this.state.isChoose.isCom,isPeo: false,isGov: false}
                                    })
                                }}>企业</Text>

                            <Text style={this.state.isChoose.isPeo ? styles.options_text_choose : styles.options_text_unchoose}
                                  onPress={() => {
                                      this.setState({
                                          isChoose:{isCom: false,isPeo: !this.state.isPeo,isGov: false}
                                      })
                                  }}>个人</Text>
                            <Text style={this.state.isChoose.isGov ? styles.options_text_choose : styles.options_text_unchoose}
                                  onPress={() => {
                                      this.setState({
                                          isChoose:{isCom: false,isPeo: false,isGov: !this.state.isGov}
                                      })
                                  }}>政府机关行政单位</Text>
                        </View>

                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <View style={styles.item}>
                            <Text style={styles.title}>{this.state.isChoose.isCom?'企业名称':this.state.isChoose.isPeo?'姓名':'单位名称'}</Text>
                            <TextInput
                                multiline={false}
                                androidinlineImageRight={'../res/images/ic_delete.png'}
                                placeholder={this.state.isChoose.isCom?'请填写企业名称':this.state.isChoose.isPeo?'请填写姓名':'请填写单位名称'}
                                placeholderTextColor={'#c4c4c4'}
                                iosclearButtonMode='while-editing'
                                underlineColorAndroid="transparent"
                                style={styles.textInput}
                                onBlur={() => this.disShowModal()}
                                defaultValue={this.state.com_name === '' ? null : this.state.com_name}
                                onChangeText={(text) => {
                                    if (text === "b") {
                                        this.showModal()
                                    } else {
                                        this.disShowModal()
                                    }
                                }}
                                onEndEditing={() => {
                                    this.setState({
                                        title: this.state.com_name
                                    })
                                }}
                            />

                        </View>
                        <View style={{height: 1, backgroundColor: '#fbfbfb', marginLeft: 20, marginRight: 20}}/>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <View style={styles.item}>
                            <View style={{width: 100, flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={styles.title1}>税号</Text>
                                <Image style={{width: 20, height: 20}}
                                       source={require('../res/images/ic_warning.png')}/>
                            </View>
                            <TextInput multiline={false}
                                       ref={'text'}
                                       placeholder={'请输入税号'}
                                       placeholderTextColor={'#c4c4c4'}
                                       iosclearButtonMode={true}
                                       underlineColorAndroid="transparent"
                                       style={styles.textInput}/>

                        </View>
                    </View>
                    <View style={styles.no_must}>

                        <Text style={{color: '#c4c4c4', fontSize: 15, paddingLeft: 25}}>非必填</Text>
                    </View>
                    {this.renderItems('开户行', '填写开户行名称')}
                    {this.renderItems('开户账号', '填写开户行账号')}
                    {this.renderItems(this.state.isChoose.isCom?'公司地址':this.state.isChoose.isPeo?'个人地址':'单位地址', this.state.isChoose.isCom?'请填写公司地址':this.state.isChoose.isPeo?'请填写个人地址':'请填写单位地址')}
                    {this.renderItems(this.state.isChoose.isCom?'公司电话':this.state.isChoose.isPeo?'个人电话':'单位电话', this.state.isChoose.isCom?'请填写公司电话':this.state.isChoose.isPeo?'请填写个人电话':'请填写单位电话')}
                </View>
                <TouchableOpacity
                    style={{margin: 10, backgroundColor: '#F59B38', justifyContent: 'center', borderRadius: 5}}
                    onPress={() => {

                    }}>
                    <Text style={styles.btn_save}>保存并使用</Text>

                </TouchableOpacity>
                {this.state.isModal ? popupView : null}

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0EFF4',

    },
    info: {
        backgroundColor: 'white',
    },
    options_out: {
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 10,
        paddingTop: 20,
    },
    options: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    options_text_unchoose: {
        fontSize: 16,
        color: '#D5D5D5',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#D5D5D5',
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 8,
        paddingTop: 8,
        backgroundColor: '#fff',
    },
    options_text_choose: {
        fontSize: 16,
        color: '#D5D5D5',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#D5D5D5',
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 8,
        paddingTop: 8,
        backgroundColor: '#52B8CF',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 5,
        alignItems: 'center'
    },
    title: {
        color: '#949494',
        width: 100,
        fontSize: 15,
        padding: 10,
    },
    title1: {
        color: '#949494',
        fontSize: 15,
        padding: 10,
    },
    textInput: {
        padding: 0,
        flex: 1,

    },
    no_must: {
        backgroundColor: '#F0EFF4',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center'
    },
    btn_save: {
        height: 40,
        fontSize: 20,
        color: 'white',
        textAlignVertical: 'center',
        alignSelf: 'center'
    },
    text_item_title: {
        fontSize: 15,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 5,
        color: '#52B8CF'
    },
    text_item_num: {
        fontSize: 12,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10,
        color: '#B3B6B9'
    }
});
