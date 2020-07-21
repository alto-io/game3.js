import { VISIBILITY_FILTERS } from "./constants";

export const getRimbleState = store => {
  return store.rimble;
};

// ProgressAlert selectors
export const getProgressAlertsState = store => store.progressAlerts;

export const getProgressAlertList = store =>
  getProgressAlertsState(store) ? getProgressAlertsState(store).allIds : [];

export const getProgressAlertById = (store, id) =>
  getProgressAlertsState(store)
    ? { ...getProgressAlertsState(store).byIds[id], id }
    : {};

/**
 * example of a slightly more complex selector
 * select from store combining information from multiple reducers
 */
export const getProgressAlerts = store =>
  getProgressAlertList(store).map(id => getProgressAlertById(store, id));

export const getProgressAlertsByVisibilityFilter = (
  store,
  visibilityFilter
) => {
  const allProgressAlerts = getProgressAlerts(store);
  switch (visibilityFilter) {
    case VISIBILITY_FILTERS.COMPLETED:
      return allProgressAlerts.filter(progressAlert => progressAlert.completed);
    case VISIBILITY_FILTERS.INCOMPLETE:
      return allProgressAlerts.filter(
        progressAlert => !progressAlert.completed
      );
    case VISIBILITY_FILTERS.ALL:
    default:
      return allProgressAlerts;
  }
};
