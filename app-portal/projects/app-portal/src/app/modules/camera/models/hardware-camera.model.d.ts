export interface Range {
  min: number;
  max: number;
}

export interface HardwareCameraModel {
  distanceRange: Range;
  lightLevelRange: Range;
}
