import {
  isSameDay
} from "./chunk-R3FDEKCQ.js";
import "./chunk-UEKGJVRP.js";
import {
  constructFrom
} from "./chunk-RZVULXZC.js";
import "./chunk-G3PMV62Z.js";

// node_modules/date-fns/constructNow.js
function constructNow(date) {
  return constructFrom(date, Date.now());
}

// node_modules/date-fns/isToday.js
function isToday(date, options) {
  return isSameDay(
    constructFrom(options?.in || date, date),
    constructNow(options?.in || date)
  );
}
var isToday_default = isToday;
export {
  isToday_default as default,
  isToday
};
//# sourceMappingURL=date-fns_isToday.js.map
