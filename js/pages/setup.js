/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Navigator} from 'react-native-deprecated-custom-components'
import MobxTest from "../MobxTest";
import MyPageTest from "./My/MyPageTest";
import WelcomePage from "./WelcomePage";

function setup() {
    //进行一些初始化的配置
    class Root extends Component {
        renderScene(route, navigator) {
            let Component = route.component;
            return <Component {...route.params} navigator={navigator}/>
        }

        render() {
            return <Navigator
                initialRoute={{component: WelcomePage}}
                renderScene={(route, navigator)=>this.renderScene(route, navigator)}
            />
        }
    }
    return <Root/>;
}

module.exports = setup;
