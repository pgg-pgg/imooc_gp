import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository'
import DescPage from "../pages/popular/DescPage";

export default class ActionUtils {
    /**
     * 跳转到详情页
     * @param params 要传递的一些参数
     */
    static onSelectRepository(params) {
        var {navigator}=params;
        navigator.push({
            component: DescPage,
            params: {
                ...params
            },
        });
    }

    /**
     * favoriteIcon单击回调函数
     * @param favoriteDao
     * @param item
     * @param isFavorite
     * @param flag
     */
    static onFavorite(favoriteDao,item, isFavorite,flag) {
        var key=flag===FLAG_STORAGE.flag_trending? item.fullName:item.id.toString();
        if (isFavorite) {
            favoriteDao.saveFavoriteItem(key, JSON.stringify(item));
        } else {
            favoriteDao.removeFavoriteItem(key);
        }
    }
}
