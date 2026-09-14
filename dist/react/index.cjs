"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/react/index.ts
var react_exports = {};
__export(react_exports, {
  useOtpTimer: () => useOtpTimer
});
module.exports = __toCommonJS(react_exports);
var import_react = require("react");
function useOtpTimer(options) {
  const initialSeconds = options?.seconds ?? 60;
  const autoStart = options?.autoStart ?? true;
  const [timeLeft, setTimeLeft] = (0, import_react.useState)(initialSeconds);
  const [isActive, setIsActive] = (0, import_react.useState)(autoStart);
  (0, import_react.useEffect)(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1e3);
    } else if (timeLeft <= 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);
  const startTimer = (0, import_react.useCallback)(() => {
    setTimeLeft(initialSeconds);
    setIsActive(true);
  }, [initialSeconds]);
  const resetTimer = (0, import_react.useCallback)(() => {
    setTimeLeft(initialSeconds);
    setIsActive(false);
  }, [initialSeconds]);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return {
    timeLeft,
    formattedTime,
    isActive,
    canResend: !isActive && timeLeft === 0,
    startTimer,
    resetTimer
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useOtpTimer
});
//# sourceMappingURL=index.cjs.map