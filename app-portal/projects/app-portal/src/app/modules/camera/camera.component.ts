import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { HardwareCameraModel, Range } from './models/hardware-camera.model';
import { CameraService } from './camera.service';

type RangeFormShape = {
  [Key in keyof Range]: FormControl<Range[Key] | null>;
};

interface HardwareCameraFormShape {
  distanceRange: FormGroup<RangeFormShape>;
  lightLevelRange: FormGroup<RangeFormShape>;
}

interface FormShape {
  desiredDistanceRange: FormGroup<RangeFormShape>;
  desiredLightLevelRange: FormGroup<RangeFormShape>;
  cameras: FormArray<FormGroup<HardwareCameraFormShape>>;
}

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf],
  providers: [CameraService],
})
export class CameraComponent implements OnInit {
  private readonly _cameraService = inject(CameraService);

  public readonly $isCoverageSufficient = signal(false);

  get camerasFormArray(): FormArray {
    return this.form.get('cameras') as FormArray;
  }

  public form!: FormGroup<FormShape>;

  public ngOnInit(): void {
    this.form = this.createForm();
  }

  public checkCoverageSufficient(): void {
    if (this.form.invalid) {
      return;
    }
    const { desiredDistanceRange, desiredLightLevelRange, cameras } = this.form.value;
    const isCoverageSufficient = this._cameraService.isCoverageSufficient(
      { min: desiredDistanceRange!.min!, max: desiredDistanceRange!.max! },
      { min: desiredLightLevelRange!.min!, max: desiredLightLevelRange!.max! },
      cameras!.map(cam => ({
        distanceRange: {
          min: cam.distanceRange!.min!,
          max: cam.distanceRange!.max!,
        },
        lightLevelRange: {
          min: cam.lightLevelRange!.min!,
          max: cam.lightLevelRange!.max!,
        },
      })),
    );
    this.$isCoverageSufficient.set(isCoverageSufficient);
  }

  public addCamera(): void {
    this.camerasFormArray.push(this.createCameraFormGroup());
  }

  public removeCamera(index: number): void {
    this.camerasFormArray.removeAt(index);
  }

  public loadFullCoverage(): void {
    const desiredDistanceRange: Range = { min: 2.0, max: 8.0 };
    const desiredLightLevelRange: Range = { min: 200, max: 800 };

    const cameras: HardwareCameraModel[] = [
      { distanceRange: { min: 1.0, max: 9.0 }, lightLevelRange: { min: 150, max: 850 } },
      { distanceRange: { min: 0.5, max: 3.0 }, lightLevelRange: { min: 100, max: 300 } },
      { distanceRange: { min: 2.0, max: 8.0 }, lightLevelRange: { min: 300, max: 900 } },
    ];
    this.form = this.createForm({ desiredDistanceRange, desiredLightLevelRange, cameras });
    this.checkCoverageSufficient();
  }

  public loadInsufficientCoverage(): void {
    const desiredDistanceRange: Range = { min: 1.0, max: 10.0 };
    const desiredLightLevelRange: Range = { min: 100, max: 1000 };

    const cameras: HardwareCameraModel[] = [
      { distanceRange: { min: 0.5, max: 3.0 }, lightLevelRange: { min: 100, max: 300 } },
      { distanceRange: { min: 4.0, max: 6.0 }, lightLevelRange: { min: 400, max: 600 } },
      { distanceRange: { min: 7.0, max: 9.0 }, lightLevelRange: { min: 700, max: 900 } },
    ];
    this.form = this.createForm({ desiredDistanceRange, desiredLightLevelRange, cameras });
    this.checkCoverageSufficient();
  }

  private createCameraFormGroup(camera?: HardwareCameraModel): FormGroup<HardwareCameraFormShape> {
    return new FormGroup<HardwareCameraFormShape>({
      distanceRange: new FormGroup({
        min: new FormControl(camera?.distanceRange?.min || 0, [Validators.required, Validators.min(0)]),
        max: new FormControl(camera?.distanceRange?.max || 100, [Validators.required, Validators.min(1)]),
      }),
      lightLevelRange: new FormGroup({
        min: new FormControl(camera?.lightLevelRange?.min || 0, [Validators.required, Validators.min(0)]),
        max: new FormControl(camera?.lightLevelRange?.max || 100, [Validators.required, Validators.min(1)]),
      }),
    });
  }

  private createForm(initialData?: {
    desiredDistanceRange: Range;
    desiredLightLevelRange: Range;
    cameras: HardwareCameraModel[];
  }): FormGroup<FormShape> {
    return new FormGroup<FormShape>({
      desiredDistanceRange: new FormGroup<RangeFormShape>({
        min: new FormControl(initialData?.desiredDistanceRange?.min || 0, [Validators.required, Validators.min(0)]),
        max: new FormControl(initialData?.desiredDistanceRange?.max || 100, [Validators.required, Validators.min(1)]),
      }),
      desiredLightLevelRange: new FormGroup<RangeFormShape>({
        min: new FormControl(initialData?.desiredLightLevelRange?.min || 0, [Validators.required, Validators.min(0)]),
        max: new FormControl(initialData?.desiredLightLevelRange?.max || 100, [Validators.required, Validators.min(1)]),
      }),
      cameras: new FormArray<FormGroup<HardwareCameraFormShape>>(
        (initialData?.cameras || []).map(cam => this.createCameraFormGroup(cam)),
        [Validators.required, Validators.minLength(1)],
      ),
    });
  }
}
