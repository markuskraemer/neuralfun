

export interface IInput
{
    input: number[];
}


export interface IPattern
{
    input: number[];
    targets: number[];
}

export interface ILesson
{
    name: string;
    training: IPattern[];
    test: IPattern []; 
}

