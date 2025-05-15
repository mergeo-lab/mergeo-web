import {
  normalizeDates,
  startOfDay
} from "./chunk-UEKGJVRP.js";

// node_modules/date-fns/isSameDay.js
function isSameDay(laterDate, earlierDate, options) {
  const [dateLeft_, dateRight_] = normalizeDates(
    options?.in,
    laterDate,
    earlierDate
  );
  return +startOfDay(dateLeft_) === +startOfDay(dateRight_);
}
var isSameDay_default = isSameDay;

export {
  isSameDay,
  isSameDay_default
};
//# sourceMappingURL=chunk-R3FDEKCQ.js.map
