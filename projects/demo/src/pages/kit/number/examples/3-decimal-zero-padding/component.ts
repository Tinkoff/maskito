import {ChangeDetectionStrategy, Component} from '@angular/core';
import mask from './mask';

@Component({
    selector: 'number-mask-doc-example-3',
    template: `
        <tui-input
            tuiTextfieldPrefix="$"
            [style.max-width.rem]="30"
            [ngModel]="value"
        >
            Cost
            <input
                tuiTextfield
                inputmode="decimal"
                [maskito]="maskitoOptions"
            />
        </tui-input>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberMaskDocExample3 {
    value = '100.00';
    maskitoOptions = mask;
}
