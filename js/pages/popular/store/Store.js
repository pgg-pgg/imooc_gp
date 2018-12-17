import {observable} from "mobx";
import DataRepository from "../../../expand/dao/DataRepository";

export default class PopularStore {
    api;

    @observable popularItems=[];

    constructor(){
        this.api=new DataRepository();
    }

    getPopularItem(id){
        return this.popularItems.find(item=>item.id.toString()===id);
    }


    @action.bound()
    fetchPopularList(tabLabel){
        return this.api.getPopularInfo(tabLabel)
            .then(action(result => {
                this.items = result && result.items ? result.items : result ? result : [];
                this.getFavoriteKeys();
                if (!this.items||result && result.update_date && !dataRepository.checkData(result.update_date)) {
                    return dataRepository.fetchNetRepository(url)
                }
            })
            .then(items => {
                if (!items || items.length === 0) {
                    return;
                } else {
                    this.items=items;
                    this.getFavoriteKeys()
                }
            })
            .catch(error => {
                console.log(error);
                this.updateState({
                    isLoading:false,
                })
            }));
    }

}
