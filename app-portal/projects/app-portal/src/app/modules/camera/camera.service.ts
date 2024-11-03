import { Injectable } from '@angular/core';

import { HardwareCameraModel, Range } from './models/hardware-camera.model';

@Injectable()
export class CameraService {
  public isCoverageSufficient(
    desiredDistanceRange: Range,
    desiredLightLevelRange: Range,
    hardwareCameras: HardwareCameraModel[],
  ): boolean {
    return (
      this.isRangeCovered(
        desiredDistanceRange,
        hardwareCameras.map(cam => cam.distanceRange),
      ) &&
      this.isRangeCovered(
        desiredLightLevelRange,
        hardwareCameras.map(cam => cam.lightLevelRange),
      )
    );
  }

  private isRangeCovered(desiredRange: Range, ranges: Range[]): boolean {
    ranges.sort((a, b) => a.min - b.min);

    // Track the current end of the covered range
    let currentCoverageEnd = desiredRange.min;

    // Expand coverage iteratively
    for (const range of ranges) {
      if (range.min <= currentCoverageEnd) {
        currentCoverageEnd = Math.max(currentCoverageEnd, range.max);
      }

      // If the coverage has reached or exceeded the desired range, return true
      if (currentCoverageEnd >= desiredRange.max) {
        return true;
      }
    }

    return currentCoverageEnd >= desiredRange.max;
  }
}
