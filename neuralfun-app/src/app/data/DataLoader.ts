
import { ILesson, LessonFactory, Lesson } from './ILessons';
import { RequestLoader } from './RequestLoader';
import { BehaviorSubject } from 'rxjs';

export class DataLoader
{
    public static NOT_STARTED: number = 0;
    public static LOAD_BUSY: number = 1;
    public static LOAD_FINISHED: number = 2;

    private count: number;
    private loader: RequestLoader = new RequestLoader ();
    private _lessons: Lesson[] = [];
    private state: number = DataLoader.NOT_STARTED;

    public stateChangedSubject:BehaviorSubject<number> = new BehaviorSubject (this.state);

    public startLoad()
    {
        this.state = DataLoader.LOAD_BUSY;
        this.count = 0;
        this.loadNext();
    }

    public get loadFinished(): boolean
    {
        return this.state == DataLoader.LOAD_FINISHED;
    }

    public get lessons(): Lesson[]
    {
        return this._lessons;
    }

    private loadNext(): void
    {
        this.count++;
        var url: string = './assets/lessons/' + this.count + '.json';
        console.log("load: " + url);
        this.loader.get(url).then(
            (value) =>
            {
                this.handleDataLoadedOK(value);
            },
            (value) =>
            {
                this.handleDataLoadedReject(value);
            }
        ); 

    }

    private handleDataLoadedOK(value): void
    {
        console.log("loadedOK: " , value);
        this._lessons.push(LessonFactory.createLesson (JSON.parse(value)));
        this.loadNext();
    }

    private handleDataLoadedReject(value): void
    {
        console.log("handleDataLoadedReject: " + this.count + " : " + value);
        this.state = DataLoader.LOAD_FINISHED;
        this.stateChangedSubject.next(this.state);
    }
}