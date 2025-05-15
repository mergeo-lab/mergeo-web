import {
  useLayoutEffect2
} from "./chunk-FHMZAUHF.js";
import {
  Primitive
} from "./chunk-6CKBQ5RK.js";
import {
  require_react_dom
} from "./chunk-SDFBWO5I.js";
import {
  require_jsx_runtime
} from "./chunk-ICEAERXH.js";
import {
  require_react
} from "./chunk-TVFQMRVC.js";
import {
  __toESM
} from "./chunk-G3PMV62Z.js";

// node_modules/@radix-ui/react-portal/dist/index.mjs
var React = __toESM(require_react(), 1);
var import_react_dom = __toESM(require_react_dom(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var PORTAL_NAME = "Portal";
var Portal = React.forwardRef((props, forwardedRef) => {
  const { container: containerProp, ...portalProps } = props;
  const [mounted, setMounted] = React.useState(false);
  useLayoutEffect2(() => setMounted(true), []);
  const container = containerProp || mounted && globalThis?.document?.body;
  return container ? import_react_dom.default.createPortal((0, import_jsx_runtime.jsx)(Primitive.div, { ...portalProps, ref: forwardedRef }), container) : null;
});
Portal.displayName = PORTAL_NAME;

export {
  Portal
};
//# sourceMappingURL=chunk-TCFGPMP5.js.map
