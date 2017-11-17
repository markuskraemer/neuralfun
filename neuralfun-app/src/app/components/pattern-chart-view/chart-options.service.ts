import { Injectable } from '@angular/core';

export enum ChartSegment {
    ALL = 0,
    ONLY_LAST = 1
}


@Injectable()
export class ChartOptionsService {


    public readonly segments:any[] = [
        {name:'all', id:ChartSegment.ALL},
        {name:'only last', id:ChartSegment.ONLY_LAST}
    ]


}



