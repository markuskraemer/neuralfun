import { RequestLoader } from './RequestLoader';


export interface IPattern
{
    input: number[];
    targets: number[];
    canvasDataURL?:string;
}

export interface ILesson
{
    name: string;
    training: IPattern[];
    test: IPattern []; 
    sources?:any;
}

export class Pattern {

    public get input ():number [] {
        // return input as e.g. [1,0,1]
        return [0];
    }

    public get targets ():number [] {
        // return targets as e.g. [1,0,1]
        return [0];
    }

}

export class Lesson {
    public training:IPattern[];
    public test:IPattern[];
   
    public get name ():string {
        return this.data.name;
    }

    constructor (protected data:ILesson){
    }    
}

export class NumericLesson extends Lesson {

    constructor (protected data:ILesson){
        super (data);    
    }

    public get training ():IPattern [] {
        return this.data.training;
    }

    public get test ():IPattern [] {
        return this.data.test;
    }    

}


export class ImageLesson extends Lesson {

    private _training:IPattern[];
    private _test:IPattern[];
    private imageRefs:any  = {};
    private canvasRefs:any  = {};

    constructor (protected data:ILesson){
        super (data);    
        this.loadSources ();
    }

    private loadSources ():void {
        let toLoad:number = 0;
        for(let sourceId in this.data.sources){
            
            let image = this.imageRefs[sourceId];
            console.log("  source: ", sourceId, this.data.sources[sourceId], " image: " + image);

            if(image != null)
                continue;
            
            image = new Image ();
            ++toLoad;
            this.imageRefs[sourceId] = image;
            image.onload = () => {
                console.log("image loaded: " + sourceId);
                this.canvasRefs[sourceId] = this.createCanvas (image, 0, 0, image.width, image.height);
                if(--toLoad == 0){
                    this.parseData ();
                }
            }
            image.src = this.data.sources[sourceId];
        }

        if(toLoad == 0){
            this.parseData ();
        }

    }

    private parseData ():void {
        this._training = this.parsePatterns (this.data.training);
        this._test = this.parsePatterns (this.data.test);
    }

    private parsePatterns (patterns:any){
        let result:any = [];
        const clippingWidth:number = this.data['clipping-width'];
        const clippingHeight:number = this.data['clipping-height'];
        for(let i:number = 0; i < patterns.length; ++i){
            let pattern = patterns[i];
            let canvas:HTMLCanvasElement = this.findCanvas(pattern.input.source);
            result.push(
                {
                    input: this.readPixels(canvas, 
                                        pattern.input.col * clippingWidth, 
                                        pattern.input.row * clippingHeight, 
                                        clippingWidth, 
                                        clippingHeight),
                    targets: this.normalize(pattern.targets),
                    canvasDataURL: this.createCanvas (canvas, 
                                                pattern.input.col * clippingWidth, 
                                                pattern.input.row * clippingHeight, 
                                                clippingWidth, 
                                                clippingHeight).toDataURL ()
                });
        }        
        return result;
    }

    private normalize (numbers:number[]):number[] {
        for(let i:number = 0; i < numbers.length; ++i){
            numbers[i] = numbers[i]/10;
        }
        return numbers;

    }

    private findCanvas (sourceId:string):HTMLCanvasElement {
        let canvas:HTMLCanvasElement = this.canvasRefs[sourceId];
        if(canvas == null){
            console.log("canvasImage, loader is null! ", canvas);
            return document.createElement('canvas');
        }else{
            return canvas;            
        }
    }

    private findImage (source:string):any{
        let image:any = this.imageRefs[source];
        if(image == null){
            console.log("findImage, loader is null! ", source);
            return new Image (1,1);
        }else{
            return image // is response an image???            
        } 
    }

    private createCanvas (source:HTMLCanvasElement|HTMLImageElement, x:number, y:number, width:number, height:number):HTMLCanvasElement{
       var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage (source, x, y, width, height, 0, 0, width, height);
        document.body.appendChild(canvas);
        return canvas;
    }


    private readPixels (canvas:HTMLCanvasElement, x:number, y:number, width:number, height:number):number[]{
        
        let result:number [] = [];
        let context:CanvasRenderingContext2D = canvas.getContext('2d');
        for(let r:number = 0; r < height; ++r){
            for(let c:number = 0; c < width; ++c){
                // console.log(r + "|" + c + " : " + context.getImageData (c, r, 1, 1).data[0]);           
                let gray:number = this.toGrayScale(context.getImageData (x+c, y+r, 1, 1)); 
                result.push (gray / 255);
            }
        }
        return result;
        
    }

    private toGrayScale (imageData:ImageData):number{
        return (imageData.data[0] + imageData.data[1] + imageData.data[2]) / 3;
    }


    public get training ():IPattern [] {
        return this._training;
    }

    public get test ():IPattern [] {
        return this._test;
    }    

}

export class LessonFactory {

    public static createLesson (data:ILesson):Lesson {
        if(data.sources !== undefined){
            return new ImageLesson (data);
        }else{
            return new NumericLesson (data);
        }
    }

}