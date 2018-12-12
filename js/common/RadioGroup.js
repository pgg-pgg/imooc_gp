import React, {Component} from 'react'
import {
    Platform,
    View,
    Text,
    Image,
    StyleSheet,
} from 'react-native'


export default class RadioGroup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectIndex: this.props.selectIndex ? this.props.selectIndex : '',
            data: this.props.data ? this.props.data : [{title: '企业',}, {title: '个人'}, {title: '政府机关行政单位'}],
        }
    }

    render() {
        let newArray = this.state.data;
        return (
            <View style={styles.options}>
                {
                    newArray.map((item, index) =>
                        this.renderRadioButton(newArray, item, this.onPress, index, this.state.selectIndex)
                    )
                }
            </View>
        )
    }


    onPress = (index, item) => {
        let array = this.state.data;
        for (let i = 0; i < array.length; i++) {
            let item = array[i];
            item.select = false;
            if (i === index) {
                item.select = true;
            }
        }
        this.setState({selectIndex: index});
        this.props.onPress ? this.props.onPress(index, item) : () => {
        }
    }

    renderRadioButton(array, item, onPress, index, sexIndex) {

        let backgroundColor = 'red';
        if (item.select === true) {
            backgroundColor = 'blue';
        } else {
            backgroundColor = 'red';
        }

        if (sexIndex === index && sexIndex !== '') {
            backgroundColor = 'blue';
        }

        return (

            <Text style={this.state.isChoose ? styles.options_text_choose : styles.options_text_unchoose}
                  onPress={() => {
                      onPress(index, item)
                  }}>{item.title}</Text>
        )
    }
}
const styles = StyleSheet.create({
    contain: {
        flex: 1,
        backgroundColor: 'white',
    }
});



