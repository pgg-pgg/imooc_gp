import DataRepository, {FLAG_STORAGE} from "../../../expand/dao/DataRepository";
import URL from './url'
import remain from './url'


export default {
    getPopularInfo: tabLabel=>new DataRepository(FLAG_STORAGE.flag_popular).fetchRepository(URL+tabLabel+remain),
}
