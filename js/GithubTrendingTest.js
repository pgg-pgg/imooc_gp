import React, {Component} from 'react';
import {
    Text,
    View,
    TextInput,
} from 'react-native';
import NavigationBar from "./common/NavigationBar";
import DataRepository, {FLAG_STORAGE} from "./expand/dao/DataRepository";

const URL='https://github.com/trending/';
export default class GithubTrendingTest extends Component{
    constructor(props){
        super(props)
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_trending);
        this.state={
            result:''
        }
    }

    onLoading(){
        alert('sdsad')
        let url = URL+this.text;
        this.dataRepository.fetchRepository(url)
            .then((result)=>{
                this.setState({
                    result:JSON.stringify(result)
                })
            })
            .then(error=>{
                this.setState({
                    result:error
                })
            })
    }

    render(){
        return (
            <View>
                <NavigationBar title={'GithubTrending'} />
                <TextInput style={{height: 30,borderWidth: 1}}
                            onChangeText={(text)=>{
                                this.text=text
                            }}/>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{fontSize:30,color:'black'}} onPress={()=>{
                        this.onLoading()
                    }}>加载数据</Text>

                    <Text style={{backgroundColor:'gray',flex: 1,height:300,width: 300,color:'black'}}>{this.state.result}</Text>
                </View>

            </View>
        )
    }

}
