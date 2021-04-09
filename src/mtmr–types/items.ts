import { MTMRAction } from "./actions";
import { MTMRAlternativeImages, MTMRImage, MTMRSource } from "./assets";

export type MTMRBaseItem = {
  align?: "left" | "center" | "right";
  width?: number;
  background?: string;
  title?: string;
  bordered?: boolean;
  image?: MTMRImage;
  actions?: MTMRAction[];
  refreshInterval?: number;
};

export type MTMRGesture = {
  type: "swipe";
  fingers: number;
  direction: "right" | "left";
  minOffset?: number;
  sourceApple?: MTMRSource;
  sourceBash: MTMRSource;
};

export type MTMRBrightness = MTMRBaseItem & {
  type: "brightness";
};

export type MTMRVolumne = MTMRBaseItem & {
  type: "volume";
};

export type MTMRStaticButton = MTMRBaseItem & {
  type: "staticButton";
  title: string;
};

export type MTMRScriptTitledButton = MTMRBaseItem & {
  type: "appleScriptTitledButton" | "shellScriptTitledButton";
  source: MTMRSource;
  alternativeImages?: MTMRAlternativeImages;
  autoResize?: boolean;
};

export type MTMRGroup = MTMRBaseItem & {
  type: "group";
  items: MTMRItem[];
};

export type MTMRClose = MTMRBaseItem & {
  type: "close";
};

export type MTMRTimeButton = MTMRBaseItem & {
  type: "timeButton";
  // formatTemplate: "dd HH:mm";
  formatTemplate?: string;
  // locale: "en_GB";
  locale?: string;
  // timeZone: "UTC"
  timeZone?: string;
};

export type MTMRWeather = MTMRBaseItem & {
  type: "weather";
  units: "metric" | "imperial";
  icon_type: "text" | "images";
  // API Key from openweather
  api_key: string;
};

export type MTMRCurrency = MTMRBaseItem & {
  type: "currency";
  // from: "BTC";
  from: string;
  // to: "USD";
  to: string;
  full: boolean;
};

export type MTMRMusic = MTMRBaseItem & {
  type: "music";
  disableMarquee: boolean;
};

export type MTMRPomodoro = MTMRBaseItem & {
  type: "pomodoro";
  workTime: number;
  restTime: number;
};

export type MTMRNetwork = MTMRBaseItem & {
  type: "network";
  flip: boolean;
};

export type MTMRDock = MTMRBaseItem & {
  type: "dock";
  // filter: "(^Xcode$)|(Safari)|(.*player)";
  filter?: string;
  autoResize?: boolean;
};

export type MTMRUpnext = MTMRBaseItem & {
  type: "upnext";
  // Lower bound of search range for next event in hours. Default 0 (current time)(can be negative to view events in the past)
  from: number;
  // Upper bounds of search range for next event in hours. Default 12 (12 hours in the future)
  to: number;
  // Limits the maximum number of events displayed. Default 3 (the first 3 upcoming events)
  maxToShow: number;
  // If true, widget will expand to display all events. Default false (scrollable view within "width")
  autoResize: boolean;
};

export type MTMRBrightnessDown = MTMRBaseItem & {
  type: "brightnessDown";
};

export type MTMRBrightnessUp = MTMRBaseItem & {
  type: "brightnessUp";
};

export type MTMREscape = MTMRBaseItem & {
  type: "escape";
};

export type MTMRExitTouchbar = MTMRBaseItem & {
  type: "exitTouchbar";
};

export type MTMRIlluminationUp = MTMRBaseItem & {
  type: "illuminationUp";
};

export type MTMRIlluminationDown = MTMRBaseItem & {
  type: "illuminationDown";
};

export type MTMRVolumeDown = MTMRBaseItem & {
  type: "volumeDown";
};

export type MTMRVolumeUp = MTMRBaseItem & {
  type: "volumeUp";
};

export type MTMRMute = MTMRBaseItem & {
  type: "mute";
};

export type MTMRBattery = MTMRBaseItem & {
  type: "battery";
};

export type MTMRInputsource = MTMRBaseItem & {
  type: "inputsource";
};

export type MTMRNightShift = MTMRBaseItem & {
  type: "nightShift";
};

export type MTMRDnd = MTMRBaseItem & {
  type: "dnd";
};

export type MTMRDarkMode = MTMRBaseItem & {
  type: "darkMode";
};

export type MTMRPrevious = MTMRBaseItem & {
  type: "previous";
};

export type MTMRPlay = MTMRBaseItem & {
  type: "play";
};

export type MTMRNext = MTMRBaseItem & {
  type: "next";
};

export type MTMRSleep = MTMRBaseItem & {
  type: "sleep";
};

export type MTMRDisplaySleep = MTMRBaseItem & {
  type: "displaySleep";
};

export type MTMRItem =
  | MTMRGesture
  | MTMRBrightness
  | MTMRVolumne
  | MTMRStaticButton
  | MTMRScriptTitledButton
  | MTMRGroup
  | MTMRClose
  | MTMRMusic
  | MTMRPomodoro
  | MTMRNetwork
  | MTMRDock
  | MTMREscape
  | MTMRBrightnessDown
  | MTMRBrightnessUp
  | MTMRExitTouchbar
  | MTMRIlluminationUp
  | MTMRIlluminationDown
  | MTMRVolumeDown
  | MTMRVolumeUp
  | MTMRMute
  | MTMRTimeButton
  | MTMRBattery
  | MTMRCurrency
  | MTMRWeather
  | MTMRInputsource
  | MTMRNightShift
  | MTMRDnd
  | MTMRDarkMode
  | MTMRUpnext
  | MTMRPrevious
  | MTMRPlay
  | MTMRNext
  | MTMRSleep
  | MTMRDisplaySleep;
