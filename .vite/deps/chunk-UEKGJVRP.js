import {
  constructFrom,
  toDate
} from "./chunk-RZVULXZC.js";

// node_modules/date-fns/_lib/normalizeDates.js
function normalizeDates(context, ...dates) {
  const normalize = constructFrom.bind(
    null,
    context || dates.find((date) => typeof date === "object")
  );
  return dates.map(normalize);
}

// node_modules/date-fns/startOfDay.js
function startOfDay(date, options) {
  const _date = toDate(date, options?.in);
  _date.setHours(0, 0, 0, 0);
  return _date;
}

export {
  normalizeDates,
  startOfDay
};
//# sourceMappingURL=chunk-UEKGJVRP.js.map
