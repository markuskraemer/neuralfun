import { NetworkHistory } from './NetworkHistory';
import { Neuron } from './Neuron';
import { InputNeuron } from './InputNeuron';
import { WorkingNeuron } from './WorkingNeuron';
import { Connection } from './Connection';

export class Network
{
    public neurons: Neuron[][] = [];
    public trainingHistory:NetworkHistory = new NetworkHistory ();
    public testHistory:NetworkHistory = new NetworkHistory ();

    constructor(private sizes: number[])
    {
        for (var i: number = 0; i < sizes.length; )
        {
            if (sizes[i] == 0)
                sizes.splice(i, 1);
            else
                ++i;
        }
        console.log("new Network: " + this.sizes);
        this.createNeurons();
        this.createConnections();
    }

    public toData(): any
    {
        return JSON.parse(JSON.stringify(this));
    }

    public toJSON(): any
    {
        return { neurons: JSON.parse(JSON.stringify(this.neurons)), squaredErrors: this.getSquaredErrors() };
    }

    public static createTestNetwork(): Network
    {
        var network: Network = new Network([2, 2, 2]);

        var inputLayer: InputNeuron[] = network.getInputLayer();
        inputLayer[0].input = .05;
        inputLayer[1].input = .10;

        var hiddenLayers: WorkingNeuron[][] = network.getHiddenLayers();        
        hiddenLayers[0][0].bias = .35;
        hiddenLayers[0][1].bias = .35;
        hiddenLayers[0][0].connections[0].weight = .15;
        hiddenLayers[0][0].connections[1].weight = .20;
        hiddenLayers[0][1].connections[0].weight = .25;
        hiddenLayers[0][1].connections[1].weight = .30;

        var outputLayer: WorkingNeuron[] = network.getOutputLayer();
        outputLayer[0].target = .01;
        outputLayer[1].target = .99;
        outputLayer[0].bias = .60;
        outputLayer[1].bias = .60;
        outputLayer[0].connections[0].weight = .40;
        outputLayer[0].connections[1].weight = .45;
        outputLayer[1].connections[0].weight = .50;
        outputLayer[1].connections[1].weight = .55;

        return network;
    }

    public getSquaredErrors(): number
    {
        var result: number = 0;
        var outputLayer: WorkingNeuron[] = this.getOutputLayer();
        for (let i: number = 0; i < outputLayer.length; ++i)
        {
            let neuron: WorkingNeuron = outputLayer[i];
            result += neuron.squaredDelta;
        }
        return result;
    }

    public getOutputsString(): string
    {
        var result: string = "";
        var outputLayer: WorkingNeuron[] = this.getOutputLayer();
        for (var i: number = 0; i < outputLayer.length; ++i)
        {
            result += i + ":" + outputLayer[i].output + "  ";
        }
        return result;
    } 
    
    public getInputLayer(): InputNeuron[]
    {
        return this.neurons[0] as InputNeuron[];
    }

    public getHiddenLayers(): WorkingNeuron[][]
    {
        return this.neurons.slice(1, this.neurons.length - 1) as WorkingNeuron[][];
    }

    public getOutputLayer(): WorkingNeuron[]
    {
        return this.neurons[this.neurons.length-1] as WorkingNeuron[];
    }

    public setHiddenLayerLength(length: number): void
    {
        if (length == 0)
        {
            while (this.sizes.length > 2)
            {
                this.sizes.splice(1, 1);
                this.neurons.splice(1, 1);
            }
        } else
        {
            if (this.sizes.length == 2)
            {
                var last: number = this.sizes.pop();
                this.sizes.push(length);
                this.sizes.push(last);
            } else
            {
                this.sizes[1] = length;
            }
        }
        console.log("setHiddenLayerLength: " + this.sizes);
        this.createNeurons();
        this.removeOverrunNeurons();
        this.createConnections();
        this.removeOverrunConnections();
    }

    public setInputs(inputs:number[]): void
    {
        var inputLayer: InputNeuron[] = this.getInputLayer();
        for (let i: number = 0; i < inputLayer.length; ++i)
        {
            inputLayer[i].input = inputs[i];
        }
    }

    public setOutputTargets(targets:number[]): void
    {
        var outputLayer: WorkingNeuron[] = this.getOutputLayer();
        for (let i: number = 0; i < outputLayer.length; ++i)
        {
            outputLayer[i].target = targets[i];
        }
    }


    private createNeurons(): void
    {
        for (var i: number = 0; i < this.sizes.length; ++i)
        {
            var neuronsInLayerCount: number = this.sizes[i];
            var layer: Neuron[] = this.neurons[i] || [];
            for (var j: number = layer.length; j < neuronsInLayerCount; ++j)
            {
                if(i == 0)
                    var neuron: Neuron = new InputNeuron();
                else
                    var neuron: Neuron = new WorkingNeuron(0);
                neuron.id = i + "" + j;
                layer.push(neuron);
            }
            this.neurons[i] = layer;
        }
    }

    private removeOverrunNeurons(): void
    {
        for (var i: number = 0; i < this.neurons.length; ++i)
        {
            var layer: Neuron[] = this.neurons[i];
            layer.length = this.sizes[i];
        }
    }

    private removeOverrunConnections(): void
    {
        for (var i: number = 1; i < this.neurons.length; ++i)
        {
            var fromLayer: Neuron[] = this.neurons[i - 1];
            var toLayer: Neuron[] = this.neurons[i];
            for (var j: number = 0; j < toLayer.length; ++j)
            {
                let neuron: Neuron = toLayer[j];
                neuron.connections.length = fromLayer.length;
            }
        }
    }

    private getDefaultConnectionWeight(): number
    {
        return 0;
    }

    private createConnections(): void
    {
        for (var i: number = 1; i < this.neurons.length; ++i)
        {
            var fromLayer: Neuron[] = this.neurons[i-1];
            var toLayer: Neuron[] = this.neurons[i];
            for (var j: number = 0; j < toLayer.length; ++j)
            {
                let neuron: Neuron = toLayer[j]
                for (var k: number = 0; k < fromLayer.length; ++k)
                {
                    if (!neuron.hasConnection(fromLayer[k]))
                    {
                        let connection: Connection = new Connection(fromLayer[k], this.getDefaultConnectionWeight());
                        connection.id = i + '' + j + '' + k;
                        neuron.addConnection(connection);
                    }
                }

            }
        }
    }



    public updateWeights(): void
    {
        for (var i: number = 0; i < this.neurons.length; ++i)
        {
            for (var j: number = 0; j < this.neurons[i].length; ++j)
            {
                for (var k: number = 0; k < this.neurons[i][j].connections.length; ++k)
                {
                    this.neurons[i][j].connections[k].updateWeight();
                }
            }
        }
    }

    public writeToTestHistory ():void {
        this.testHistory.add(this.toJSON());
    }

    public writeToTrainingHistory ():void {
        this.trainingHistory.add(this.toJSON());
    }


    public trainDelta(): void
    {
        var outputLayer: WorkingNeuron[] = this.getOutputLayer();
        for (var neuron of outputLayer)
            neuron.trainWeightsDelta();

    }

    public trainBackPropagation(): void
    {    
        this.trainOutputNeuronsBackPropagation();
        if (this.neurons.length > 2)
            this.trainHiddenNeuronsBackPropagation();
        this.updateWeights();
    }

    private trainOutputNeuronsBackPropagation (): void
    {
        var outputLayer: WorkingNeuron[] = this.getOutputLayer();
        for (var neuron of outputLayer)
            neuron.trainWeightsBackPropagation(neuron.output - neuron.target);
    }

    private trainHiddenNeuronsBackPropagation(): void
    {
        var hiddenLayer: WorkingNeuron[] = this.getHiddenLayers()[0];
        for (var i: number = 0; i < hiddenLayer.length; ++i)
        {
            var backsum: number = this.getBacksum(i);
            hiddenLayer[i].trainWeightsBackPropagation(backsum);
        }        
    }

    private getBacksum(idx: number): number
    {
        var outputLayer: WorkingNeuron[] = this.getOutputLayer();
        var result: number = 0;
        for (var i: number = 0; i < outputLayer.length; ++i)
        {
            var neuron: WorkingNeuron = outputLayer[i];
            result += (neuron.output - neuron.target) * neuron.derivate(neuron.output) * neuron.connections[idx].weight;
        }
        return result;
    }

}
