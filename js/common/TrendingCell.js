import React, {Component} from 'react'
import {
    Platform,
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import HTMLView from 'react-native-htmlview';


export default class TrendingCell extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isFavorite: this.props.projectModel.isFavorite,
            favoriteIcon: this.props.projectModel.isFavorite?require('../../res/images/ic_star.png'):require('../../res/images/ic_unstar_transparent.png')
        }

    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        this.setFavoriteState(nextProps.projectModel.isFavorite);
    }

    onPressFavorite() {
        this.setFavoriteState(!this.state.isFavorite);
        this.props.onFavorite(this.props.projectModel.item,!this.state.isFavorite);

    }

    setFavoriteState(isFavorite) {
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_unstar_transparent.png')
        })
    }

    render() {

        let favoriteButton = <TouchableOpacity onPress={() => this.onPressFavorite()}>
            <Image style={{width: 22, height: 22, tintColor: '#2196f3'}} source={this.state.favoriteIcon}/>
        </TouchableOpacity>;
        let item = this.props.projectModel.item ? this.props.projectModel.item : this.props.projectModel;

        let desc = '<p>' + item.description + '</p>';

        return <TouchableOpacity style={styles.container}
                                 onPress={this.props.onSelect}>
            <View style={styles.cell_container}>
                <Text style={styles.title}>{item.fullName}</Text>
                <HTMLView
                    stylesheet={{
                        p: styles.description,
                        a: styles.description
                    }}
                    value={desc} onLinkPress={(url) => {
                }}/>
                <Text style={styles.description}>{item.meta}</Text>

                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={styles.description}>BuildBy:</Text>
                        {item.contributors.map((result, i, arr) => {
                            return <Image
                                key={i}
                                style={{height: 22, width: 22}}
                                source={{uri: arr[i]}}/>
                        })}

                    </View>
                    {favoriteButton}
                </View>

            </View>
        </TouchableOpacity>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121'
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575'
    },
    cell_container: {
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        borderColor: '#dddddd',
        marginVertical: 3,
        borderWidth: 0.5,
        borderRadius: 5,
        shadowColor: 'gray',
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 2,
    }
});
