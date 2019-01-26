import React, { Component } from 'react';
import { StyleSheet, View, ListView, RefreshControl } from 'react-native';


class Feed extends Component {
    constructor(props){
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2}),
            loaded: false,
            isAnimating: true,
            isRefreshing: false
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    filterNews(news = []){
        return new Promise((resolve ) => {
            const filtered = news.filter(item => {
                return item.content.format === 'bbc.mobile.news.format.textual';
            });
            resolve(filtered);
        });
    }

    fetchData() {
        this.setState({ isRefreshing: true });
        fetch('https://newsapi.org/v2/everything?q=bitcoin&from=2018-12-26&sortBy=publishedAt&apiKey=b43f4059c65c40e4945ab40e30b8573c')
            .then((res) => res.json())
            .then((responseData) =>this.filterNews(responseData.relations))
            .then((newsItems) => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(newsItems),
                    loaded: true,
                    isRefreshing: false,
                    isAnimating: false
                });
            }).done();
    }

    render() {
        return (
            <ListView
                testID={'Feed Screen'}
                dataSource={this.state.dataSource}
                //renderRow={this.renderStories}
                style={styles.listView}
                contentInset={{top: 0, left: 0, bottom: 64, right: 0}}
                scrollEventThrottle={200}
                {...this.props}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={this.fetchData}
                        tintColor="#bb1919"
                        title="Loading..."
                        progressBackgroundColor='#ffff00'
                    />
                }
            />
        );
    }

}

const styles = StyleSheet.create({
    listView: {
        backgroundColor: '#000'
    }
});
export default Feed;
