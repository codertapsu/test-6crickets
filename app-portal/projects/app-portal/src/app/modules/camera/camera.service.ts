import { Injectable } from '@angular/core';

import { HardwareCameraModel, Range } from './models/hardware-camera.model';

@Injectable()
export class CameraService {
  public isCoverageSufficient(
    desiredDistanceRange: Range,
    desiredLightLevelRange: Range,
    hardwareCameras: HardwareCameraModel[],
  ): boolean {
    // Validation
    this.validateRange(desiredDistanceRange);
    this.validateRange(desiredLightLevelRange);
    hardwareCameras.forEach(camera => {
      this.validateRange(camera.distanceRange);
      this.validateRange(camera.lightLevelRange);
    });

    // Check if any single camera suffices
    if (
      hardwareCameras.some(
        cam =>
          this.isRangeFullyCovered(desiredDistanceRange, cam.distanceRange) &&
          this.isRangeFullyCovered(desiredLightLevelRange, cam.lightLevelRange),
      )
    ) {
      return true;
    }

    // Check if combined cameras cover the ranges
    return (
      this.isCombinedRangeCovered(
        desiredDistanceRange,
        hardwareCameras.map(cam => cam.distanceRange),
      ) &&
      this.isCombinedRangeCovered(
        desiredLightLevelRange,
        hardwareCameras.map(cam => cam.lightLevelRange),
      )
    );
  }

  private isRangeFullyCovered(desiredRange: Range, range: Range): boolean {
    return range.min <= desiredRange.min && range.max >= desiredRange.max;
  }

  private isCombinedRangeCovered(desiredRange: Range, ranges: Range[]): boolean {
    // Sort ranges by their starting points
    ranges.sort((a, b) => a.min - b.min);

    let currentCoverageEnd = desiredRange.min;

    // Expand coverage iteratively
    for (const range of ranges) {
      if (range.min > currentCoverageEnd) {
        // Gap detected, coverage is insufficient
        return false;
      }

      currentCoverageEnd = Math.max(currentCoverageEnd, range.max);

      if (currentCoverageEnd >= desiredRange.max) {
        // Desired range fully covered
        return true;
      }
    }

    // Final check if the coverage end reaches or exceeds the desired range max
    return currentCoverageEnd >= desiredRange.max;
  }

  private validateRange(range: Range): void {
    if (range.min > range.max) {
      throw new Error(`Invalid range: min (${range.min}) should not exceed max (${range.max}).`);
    }
  }
}
