import { Action } from "./actions";
import { AlternativeImages, Image, JsSource, Source } from "./assets";

export type BaseItem = {
  align?: "left" | "center" | "right";
  width?: number;
  background?: string;
  title?: string;
  bordered?: boolean;
  image?: Image;
  actions?: Action[];
  refreshInterval?: number;
  currentPath?: string;
};

export type Gesture = BaseItem & {
  type: "swipe";
  fingers: number;
  direction: "right" | "left";
  minOffset?: number;
  sourceApple?: Source;
  sourceBash: Source;
};

export type Brightness = BaseItem & {
  type: "brightness";
};

export type Volumne = BaseItem & {
  type: "volume";
};

export type StaticButton = BaseItem & {
  type: "staticButton";
  title: string;
};

export type AppleScriptTitledButton = BaseItem & {
  type: "scriptTitledButton";
  sourceType: "appleScript";
  appleScriptSource: Source;
  alternativeImages?: AlternativeImages;
  autoResize?: boolean;
};

export type JavaScriptTitledButton = BaseItem & {
  type: "scriptTitledButton";
  sourceType: "javaScript";
  jsSource: JsSource;
  alternativeImages?: AlternativeImages;
  autoResize?: boolean;
};

export type ShellScriptTitledButton = BaseItem & {
  type: "scriptTitledButton";
  sourceType: "shellScript";
  shellScriptSource: Source;
  alternativeImages?: AlternativeImages;
  autoResize?: boolean;
};

export type ScriptTitledButton =
  | AppleScriptTitledButton
  | JavaScriptTitledButton
  | ShellScriptTitledButton;

export type Group = BaseItem & {
  type: "group";
  items: Item[];
};

export type Close = BaseItem & {
  type: "close";
};

export type TimeButton = BaseItem & {
  type: "timeButton";
  // formatTemplate: "dd HH:mm";
  formatTemplate?: string;
  // locale: "en_GB";
  locale?: string;
  // timeZone: "UTC"
  timeZone?: string;
};

export type Weather = BaseItem & {
  type: "weather";
  units: "metric" | "imperial";
  icon_type: "text" | "images";
  // API Key from openweather
  api_key: string;
};

export type Currency = BaseItem & {
  type: "currency";
  // from: "BTC";
  from: string;
  // to: "USD";
  to: string;
  full: boolean;
};

export type Music = BaseItem & {
  type: "music";
  disableMarquee: boolean;
};

export type Pomodoro = BaseItem & {
  type: "pomodoro";
  workTime: number;
  restTime: number;
};

export type Network = BaseItem & {
  type: "network";
  flip: boolean;
};

export type Dock = BaseItem & {
  type: "dock";
  // filter: "(^Xcode$)|(Safari)|(.*player)";
  filter?: string;
  autoResize?: boolean;
};

export type Upnext = BaseItem & {
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

export type BrightnessDown = BaseItem & {
  type: "brightnessDown";
};

export type BrightnessUp = BaseItem & {
  type: "brightnessUp";
};

export type Escape = BaseItem & {
  type: "escape";
};

export type ExitTouchbar = BaseItem & {
  type: "exitTouchbar";
};

export type IlluminationUp = BaseItem & {
  type: "illuminationUp";
};

export type IlluminationDown = BaseItem & {
  type: "illuminationDown";
};

export type VolumeDown = BaseItem & {
  type: "volumeDown";
};

export type VolumeUp = BaseItem & {
  type: "volumeUp";
};

export type Mute = BaseItem & {
  type: "mute";
};

export type Battery = BaseItem & {
  type: "battery";
};

export type Inputsource = BaseItem & {
  type: "inputsource";
};

export type NightShift = BaseItem & {
  type: "nightShift";
};

export type Dnd = BaseItem & {
  type: "dnd";
};

export type DarkMode = BaseItem & {
  type: "darkMode";
};

export type Previous = BaseItem & {
  type: "previous";
};

export type Play = BaseItem & {
  type: "play";
};

export type Next = BaseItem & {
  type: "next";
};

export type Sleep = BaseItem & {
  type: "sleep";
};

export type DisplaySleep = BaseItem & {
  type: "displaySleep";
};

export type Item =
  | Gesture
  | Brightness
  | Volumne
  | StaticButton
  | ScriptTitledButton
  | Group
  | Close
  | Music
  | Pomodoro
  | Network
  | Dock
  | Escape
  | BrightnessDown
  | BrightnessUp
  | ExitTouchbar
  | IlluminationUp
  | IlluminationDown
  | VolumeDown
  | VolumeUp
  | Mute
  | TimeButton
  | Battery
  | Currency
  | Weather
  | Inputsource
  | NightShift
  | Dnd
  | DarkMode
  | Upnext
  | Previous
  | Play
  | Next
  | Sleep
  | DisplaySleep;
