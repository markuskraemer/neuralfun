import { Neuron } from './Neuron';

export class InputNeuron extends Neuron
{
    protected _input: number = 0;
    public get output(): number
    {
        return (this._input);
    }

    public get input(): number
    {
        return this._input;
    }

    public set input(n: number)
    {
        this._input = n;
    }

    public toJSON(): any
    {
        let { output, id } = this;
        return { output, id };
    }
}