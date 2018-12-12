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
    AsyncStorage,
} from 'react-native';
import NavigationBar from "../common/NavigationBar";
import Toast,{DURATION} from 'react-native-easy-toast';
const KEY='text';
export default class AsyncStoragePage extends Component{
    onSave(){
        AsyncStorage.setItem(KEY,this.text,(error => {
            if (!error){
                this.toast.show('保存成功',DURATION.LENGTH_SHORT)
            }else {
                this.toast.show('保存失败',DURATION.LENGTH_SHORT)
            }
        }))
    }
    onRemove(){
        AsyncStorage.removeItem(KEY,(error => {
            if (!error){
                this.toast.show('移除成功',DURATION.LENGTH_SHORT)
            }else {
                this.toast.show('移除失败',DURATION.LENGTH_SHORT)
            }
        }))
    }
    onFetch(){
        AsyncStorage.getItem(KEY,(error,result)=>{
            if (!error){
                if (result!==''&&result!==null) {
                    this.toast.show('取出的内容为' + result)
                }else {
                    this.toast.show('key不存在')
                }
            }else {
                this.toast.show('取出失败')

            }
        })
    }
    render(){
        return <View style={styles.container}>
            <NavigationBar title={'收藏'} style={{backgroundColor:"#2196f3"}}/>
            <TextInput style={{borderWidth: 1,height: 40,margin: 5}}
                       onChangeText={(text)=>this.text=text}
            />
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.tips} onPress={()=>this.onSave()}>保存</Text>
                <Text style={styles.tips} onPress={()=>this.onRemove()}>移除</Text>
                <Text style={styles.tips} onPress={()=>this.onFetch()}>取出</Text>
            </View>
            <Toast ref={toast=>{this.toast=toast}}/>

        </View>
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    page1:{
        flex: 1,
    },
    page2:{
        flex: 2,
        backgroundColor: 'green'
    },
    image:{
        width:22,
        height:22
    },
    tips:{
        fontSize:20,
        color:'black',
        margin: 10
    }
});
