import { Injectable } from '@angular/core';

@Injectable()
export class ColorService {

    public getOutputNeuronColor (index:number):string{
        let colors:string[] = [
                                '#93d1ff',
                                '#60bafd',
                                '#3eacff',
                                '#0d97ff',
                                '#71c7ec',
                                '#1ebbd7',
                                '#189ad3',
                                '#107dac',
                                '#005073'
                                ]

        return colors[index%colors.length];
    }


    public getSquaredDeltaColor (index:number):string { 
        let colors:string[] = [
                                '#ffd193',
                                '#fdba60',
                                '#ffac3e',
                                '#ff970d',
                                '#ecc771',
                                '#d7bb1e',
                                '#d39a18',
                                '#ac7d10',
                                '#735000'


        ];
        return colors[index%colors.length];
    }

}