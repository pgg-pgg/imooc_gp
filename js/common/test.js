import Autocomplete from 'react-native-autocomplete-input';
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const films = [{title: 'aa'}, {title: 'ab'}, {title: 'AC'}, {title: 'AD'}];
export default class Component07 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            films: [],
            query: ''
        };
    }


    componentDidMount() {
        this.setState({films});
    }


    findFilm(query) {
        if (query === '') {
            return [];
        }

        const {films} = this.state;
        const regex = new RegExp(`${query.trim()}`, 'i');
        return films.filter(film => film.title.search(regex) >= 0);
    }

    render() {
        const {query} = this.state;
        const films = this.findFilm(query);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

        return (
            <View style={styles.container}>
                <Autocomplete
                    autoCapitalize="none"
                    autoCorrect={false}
                    containerStyle={styles.autocompleteContainer}
                    data={films.length === 1 && comp(query, films[0].title) ? [] : films}
                    defaultValue={query}
                    onChangeText={text => this.setState({query: text})}
                    placeholder="输入星球大战电影名称"
                    renderItem={({title, release_date}) => (
                        <TouchableOpacity onPress={() => this.setState({query: title})}>
                            <Text style={styles.itemText}>
                                {title}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
                <View style={styles.descriptionContainer}>
                    <Text style={styles.infoText}>
                        输入星球大战电影名称
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
        flex: 1,
        paddingTop: 25
    },
    autocompleteContainer: {
        marginLeft: 10,
        marginRight: 10
    },
    itemText: {
        fontSize: 15,
        margin: 2
    },
    descriptionContainer: {
        // `backgroundColor` needs to be set otherwise the
        // autocomplete input will disappear on text input.
        backgroundColor: '#F5FCFF',
        marginTop: 8
    },
    infoText: {
        textAlign: 'center'
    },
    titleText: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 10,
        marginTop: 10,
        textAlign: 'center'
    },
    directorText: {
        color: 'grey',
        fontSize: 12,
        marginBottom: 10,
        textAlign: 'center'
    },
    openingText: {
        textAlign: 'center'
    }
});
