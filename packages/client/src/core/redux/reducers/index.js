import { combineReducers } from "redux";
import progressAlerts from "./progressAlerts";
import visibilityFilter from "./visibilityFilter";
import txModals from "./txModals";

export default combineReducers({ progressAlerts, visibilityFilter, txModals });
