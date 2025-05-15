import {
  constructFrom,
  toDate
} from "./chunk-RZVULXZC.js";
import "./chunk-G3PMV62Z.js";

// node_modules/date-fns/addDays.js
function addDays(date, amount, options) {
  const _date = toDate(date, options?.in);
  if (isNaN(amount)) return constructFrom(options?.in || date, NaN);
  if (!amount) return _date;
  _date.setDate(_date.getDate() + amount);
  return _date;
}
var addDays_default = addDays;
export {
  addDays,
  addDays_default as default
};
//# sourceMappingURL=date-fns_addDays.js.map
