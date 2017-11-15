import { Neuron } from './Neuron';
import { Connection } from './Connection';

export class WorkingNeuron extends Neuron
{
    public target: number;
    private static readonly learningRate: number = .2;

    constructor(bias: number)
    {
        super();
    }


    public toJSON(): any
    {
        let { output, id, connections, squaredDelta, delta, target } = this;
        return { output, id, connections, squaredDelta, delta, target };
    }

    public addConnection(c: Connection): void
    {
        this.connections.push(c);
    }

    public get weightedSum(): number
    {
        var sum: number = 0;
        for (var c of this.connections)
        {
            sum += c.fromNeuron.output * c.weight;
        }
        return sum;

    }

    public get input(): number
    {
        return this.weightedSum + this.bias;
    }

    public get output(): number
    {
        return this.tanh(this.input);
        //return this.sigmoid(this.input);
    }

    public get delta(): number
    {
        return this.target - this.output;
    }

    public get squaredDelta(): number
    {
        return Math.pow(this.target - this.output, 2);
    }

    private activationFunc(n: number): number
    {
        return 1 / (1 + Math.exp(-n));
    }

    private tanh(n: number): number
    {
        var ePowPlusN = Math.pow(Math.E, n);
        var ePowMinusN = Math.pow(Math.E, -n);

        return (ePowPlusN - ePowMinusN) / (ePowPlusN + ePowMinusN);
    }

    private sigmoid (n: number): number
    {
        return 1 / (1 + Math.pow(Math.E, -n));
    }

    public derivate(n: number): number
    {
        return n * (1 - n);
    }

    public trainWeightsDelta(): void
    {
        for (var c of this.connections)
        {
            c.newWeight = c.weight + WorkingNeuron.learningRate * (this.target - this.output) * c.fromNeuron.output;
            c.updateWeight();
        }
    }

    public trainWeightsBackPropagation(sum:number): void
    {
        const constOutput: number = this.output;
        //console.log("der output: " + this.derivate(constOutput));
        for (var c of this.connections)
        {
            c.newWeight = c.weight - WorkingNeuron.learningRate * (sum) * this.derivate(constOutput) * c.fromNeuron.output;
        }

    }


}