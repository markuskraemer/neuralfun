

export interface IPattern
{
    input: number[];
    targets: number[];
}

export interface ILesson
{
    name: string;
    patterns: IPattern[];

}

