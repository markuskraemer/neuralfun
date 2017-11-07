import { Connection } from './Connection';


export abstract class Neuron 
{
    public connections: Connection[] = [];
  
    public addConnection(c: Connection): void
    {
    }

    public hasConnection(fromNeuron: Neuron): boolean
    {
        for (var c of this.connections)
        {
            if (c.fromNeuron == fromNeuron)
                return true;
        }
        return false;
    }

    public abstract get input(): number; 
    public id: string;
    public bias: number = 0;
    public abstract get output(): number;
    
}