import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import NavigationBar from "../../common/NavigationBar";
import CustomKeyPage from "./CustomKeyPage";
import {FLAG_LANGUAGE} from "../../expand/dao/LanguageDao";
import SortKeyPage from "./SortKeyPage";

export default class MyPageTest extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <View style={styles.container}>
            <NavigationBar title={'我的'} style={{backgroundColor: '#2196f3'}}/>
            <Text
                style={styles.tips} onPress={() => {
                this.props.navigator.push({
                    component: CustomKeyPage,
                    params: {
                        flag: FLAG_LANGUAGE.flag_key,
                        ...this.props
                    },
                })
            }
            }>自定义标签</Text>

            <Text
                style={styles.tips} onPress={() => {
                this.props.navigator.push({
                    component: CustomKeyPage,
                    params: {
                        flag: FLAG_LANGUAGE.flag_language,
                        ...this.props
                    },

                })
            }
            }>自定义语言</Text>

            <Text
                style={styles.tips} onPress={() => {
                this.props.navigator.push({
                    component: SortKeyPage,
                    params: {
                        flag: FLAG_LANGUAGE.flag_key,
                        ...this.props
                    },

                })
            }
            }>标签排序</Text>

            <Text
                style={styles.tips} onPress={() => {
                this.props.navigator.push({
                    component: CustomKeyPage,
                    params: {
                        isRemoveKey: true,
                        flag: FLAG_LANGUAGE.flag_key,
                        ...this.props
                    },

                })
            }
            }>标签移除</Text>


            <Text
                style={styles.tips} onPress={() => {
                this.props.navigator.push({
                    component: SortKeyPage,
                    params: {
                        flag: FLAG_LANGUAGE.flag_language,
                        ...this.props
                    },

                })
            }
            }>语言排序</Text>

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
    }
});
