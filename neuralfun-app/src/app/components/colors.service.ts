import { Injectable } from '@angular/core';

@Injectable()
export class ColorService {

    public getNeuronOutputColor (index:number):string{
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

    public getNeuronTargetColor (index:number):string{
        let colors:string[] = [
                                '#93ffd1',
                                '#60fdba',
                                '#3effac',
                                '#0dff97',
                                '#71ecc7',
                                '#1ed7bb',
                                '#18d39a',
                                '#10ac7d',
                                '#007350'
                                ]

        return colors[index%colors.length];
    }


    public getDeltaColor (index:number):string { 
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

    public getSquaredErrorsColor ():string {
        return 'red';
    }

}