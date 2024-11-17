import { HardwareCameraModel, Range } from './models/hardware-camera.model';
import { CameraService } from './camera.service';

/**
 * Test Cases to Cover
 * 1. Single camera fully covering the desired range
 * 2. Multiple cameras covering the range without gaps
 * 3. Gaps in the distance range
 * 4. Gaps in the light level range
 * 5. Overlapping camera ranges
 * 6. Empty hardware camera list
 * 7. Ranges matching the edge of camera ranges
 * 8. Invalid ranges
 * 9. Redundant cameras
 * 10. Large datasets
 */

describe(CameraService.name, () => {
  const cameraService = new CameraService();

  describe('isCoverageSufficient', () => {
    it('should return true for a single camera fully covering the desired range', () => {
      const desiredDistanceRange: Range = { min: 1, max: 10 };
      const desiredLightLevelRange: Range = { min: 100, max: 1000 };
      const hardwareCameras: HardwareCameraModel[] = [
        { distanceRange: { min: 1, max: 10 }, lightLevelRange: { min: 100, max: 1000 } },
      ];

      expect(cameraService.isCoverageSufficient(desiredDistanceRange, desiredLightLevelRange, hardwareCameras)).toBe(
        true,
      );
    });

    it('should return true for multiple cameras covering the range without gaps', () => {
      const desiredDistanceRange: Range = { min: 1, max: 10 };
      const desiredLightLevelRange: Range = { min: 100, max: 1000 };
      const hardwareCameras: HardwareCameraModel[] = [
        { distanceRange: { min: 1, max: 5 }, lightLevelRange: { min: 100, max: 500 } },
        { distanceRange: { min: 5, max: 10 }, lightLevelRange: { min: 500, max: 1000 } },
      ];

      expect(cameraService.isCoverageSufficient(desiredDistanceRange, desiredLightLevelRange, hardwareCameras)).toBe(
        true,
      );
    });

    it('should return false for gaps in the distance range', () => {
      const desiredDistanceRange: Range = { min: 1, max: 10 };
      const desiredLightLevelRange: Range = { min: 100, max: 1000 };
      const hardwareCameras: HardwareCameraModel[] = [
        { distanceRange: { min: 1, max: 4 }, lightLevelRange: { min: 100, max: 500 } },
        { distanceRange: { min: 6, max: 10 }, lightLevelRange: { min: 500, max: 1000 } },
      ];

      expect(cameraService.isCoverageSufficient(desiredDistanceRange, desiredLightLevelRange, hardwareCameras)).toBe(
        false,
      );
    });

    it('should return false for gaps in the light level range', () => {
      const desiredDistanceRange: Range = { min: 1, max: 10 };
      const desiredLightLevelRange: Range = { min: 100, max: 1000 };
      const hardwareCameras: HardwareCameraModel[] = [
        { distanceRange: { min: 1, max: 10 }, lightLevelRange: { min: 100, max: 300 } },
        { distanceRange: { min: 1, max: 10 }, lightLevelRange: { min: 600, max: 1000 } },
      ];

      expect(cameraService.isCoverageSufficient(desiredDistanceRange, desiredLightLevelRange, hardwareCameras)).toBe(
        false,
      );
    });

    it('should return true for overlapping camera ranges', () => {
      const desiredDistanceRange: Range = { min: 1, max: 10 };
      const desiredLightLevelRange: Range = { min: 100, max: 1000 };
      const hardwareCameras: HardwareCameraModel[] = [
        { distanceRange: { min: 1, max: 6 }, lightLevelRange: { min: 100, max: 600 } },
        { distanceRange: { min: 5, max: 10 }, lightLevelRange: { min: 400, max: 1000 } },
      ];

      expect(cameraService.isCoverageSufficient(desiredDistanceRange, desiredLightLevelRange, hardwareCameras)).toBe(
        true,
      );
    });

    it('should return false for an empty hardware camera list', () => {
      const desiredDistanceRange: Range = { min: 1, max: 10 };
      const desiredLightLevelRange: Range = { min: 100, max: 1000 };
      const hardwareCameras: HardwareCameraModel[] = [];

      expect(cameraService.isCoverageSufficient(desiredDistanceRange, desiredLightLevelRange, hardwareCameras)).toBe(
        false,
      );
    });

    it('should return true for ranges matching the edge of camera ranges', () => {
      const desiredDistanceRange: Range = { min: 1, max: 10 };
      const desiredLightLevelRange: Range = { min: 100, max: 1000 };
      const hardwareCameras: HardwareCameraModel[] = [
        { distanceRange: { min: 1, max: 10 }, lightLevelRange: { min: 100, max: 1000 } },
      ];

      expect(cameraService.isCoverageSufficient(desiredDistanceRange, desiredLightLevelRange, hardwareCameras)).toBe(
        true,
      );
    });

    it('should throw an error for invalid ranges', () => {
      const desiredDistanceRange: Range = { min: 10, max: 1 };
      const desiredLightLevelRange: Range = { min: 1000, max: 100 };
      const hardwareCameras: HardwareCameraModel[] = [
        { distanceRange: { min: 1, max: 10 }, lightLevelRange: { min: 100, max: 1000 } },
      ];

      expect(() =>
        cameraService.isCoverageSufficient(desiredDistanceRange, desiredLightLevelRange, hardwareCameras),
      ).toThrowError(
        `Invalid range: min (${desiredDistanceRange.min}) should not exceed max (${desiredDistanceRange.max}).`,
      );
    });

    it('should return true for redundant cameras', () => {
      const desiredDistanceRange: Range = { min: 1, max: 10 };
      const desiredLightLevelRange: Range = { min: 100, max: 1000 };
      const hardwareCameras: HardwareCameraModel[] = [
        { distanceRange: { min: 1, max: 10 }, lightLevelRange: { min: 100, max: 1000 } },
        { distanceRange: { min: 1, max: 5 }, lightLevelRange: { min: 100, max: 500 } },
      ];

      expect(cameraService.isCoverageSufficient(desiredDistanceRange, desiredLightLevelRange, hardwareCameras)).toBe(
        true,
      );
    });

    it('should handle large datasets efficiently', () => {
      const desiredDistanceRange: Range = { min: 1, max: 100 };
      const desiredLightLevelRange: Range = { min: 100, max: 10000 };

      // Create 10,000 cameras with small overlapping ranges, not fully covering the desired range
      const hardwareCameras: HardwareCameraModel[] = Array.from({ length: 10000 }, (_, i) => ({
        distanceRange: { min: i * 2, max: i * 2 + 1 }, // Gaps every other range
        lightLevelRange: { min: i * 200, max: i * 200 + 100 }, // Partial overlap in light levels
      }));

      expect(cameraService.isCoverageSufficient(desiredDistanceRange, desiredLightLevelRange, hardwareCameras)).toBe(
        false,
      );
    });
  });
});
