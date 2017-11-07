import { Neuron } from './Neuron';

export class Connection
{
    public newWeight: number;
    public id: string;
    constructor(public fromNeuron:Neuron, public weight: number)
    {

    }

    public updateWeight(): void
    {
        this.weight = this.newWeight;
    }
}