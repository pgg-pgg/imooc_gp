import React, {Component} from 'react';
import {
    AsyncStorage
} from 'react-native';
import Trending from "GitHubTrending/trending/GitHubTrending";

export var FLAG_STORAGE = {flag_popular:'popular',flag_trending:'trending',flag_my: 'my'};

export default class DataRepository {
    constructor(flag){
        this.flag=flag;
        if (flag===FLAG_STORAGE.flag_trending) this.trending=new Trending();
    }
    fetchRepository(url) {
        return new Promise((resolve, reject) => {
            //获取本地数据
            this.fetchLocalRepository(url)
                .then(result => {
                    if (result) {
                        resolve(result,true)
                    } else {
                        this.fetchNetRepository(url)
                            .then(result => {
                                resolve(result);
                            })
                            .catch(e => {
                                resolve(e);
                            });
                    }
                }).catch(e => {
                this.fetchNetRepository(url)
                    .then(result => {
                        resolve(result);
                    })
                    .catch(e => {
                        reject(e);
                    });

            })
        })
    }

    //获取本地数据
    fetchLocalRepository(url) {
        return new Promise((resolve, reject) => {
            //获取本地数据
            AsyncStorage.getItem(url, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(error)
                }
            })
        })
    }

    fetchNetRepository(url) {
        return new Promise((resolve, reject) => {
            if (this.flag === FLAG_STORAGE.flag_trending) {
                this.trending.fetchTrending(url)
                    .then(result=>{
                        if (!result) {
                            reject(new Error('responseData is null'))
                            return;
                        }else {
                            this.saveRepository(url,result)
                            resolve(result);
                        }

                    }).catch((error)=>{
                        reject(error)
                })

            }else {
                fetch(url)
                    .then(response => response.json())
                    .catch((error)=>{
                        reject(error);
                    })
                    .then(responseData => {
                        if (this.flag === FLAG_STORAGE.flag_my && responseData) {
                            this.saveRepository(url, responseData);
                            resolve(responseData);
                        } else if (responseData && responseData.items) {
                            this.saveRepository(url, responseData.items);
                            resolve(responseData.items);
                        } else {
                            reject(new Error('responseData is null'));
                        }
                    })
                    .catch(error => {
                        reject(error);
                    })
            }
        })
    }

    saveRepository(url, items, callback) {
        if (!items || !url)return;
        let wrapData;
        if (this.flag === FLAG_STORAGE.flag_my) {
            wrapData = {item: items, update_date: new Date().getTime()};
        } else {
            wrapData = {items: items, update_date: new Date().getTime()};
        }
        AsyncStorage.setItem(url, JSON.stringify(wrapData), callback);
    }

    /**
     * 判断数据是否过时
     * @param longTime
     * @returns {boolean}
     */
    checkData(longTime){
        let cDate = new Date();
        let tDate = new Date();
        tDate.setTime(longTime);
        if (cDate.getMonth()!==tDate.getMonth()) return false;
        if (cDate.getDay()!==tDate.getDay()) return false;
        if (cDate.getHours()-tDate.getHours()>4) return false;
        return true
    }
}
