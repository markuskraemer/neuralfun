
export class RequestLoader
{
    public static readonly STATUS_ERROR: number = -1;
    public static readonly STATUS_PENDING: number = 0;
    public static readonly STATUS_OK: number = 1;
    public static readonly STATUS_REJECTED: number = 2;

    private _status: number = 0;

    public request: XMLHttpRequest;

    public get status(): number
    {
        return this._status;
    }
    
    public get(url): Promise<string>
    {
        // Return a new promise.
        return new Promise((resolve, reject) =>
        {
            this._status = RequestLoader.STATUS_PENDING;

            this.request = new XMLHttpRequest();
            this.request.open('GET', url);

            this.request.onload = () =>
            {
                if (this.request.status == 200)
                {                 
                    this._status = RequestLoader.STATUS_OK;
                    resolve(this.request.response);
                }
                else
                {
                    this._status = RequestLoader.STATUS_REJECTED;
                    reject(Error(this.request.statusText));
                }
            };

            this.request.onerror = () =>
            {
                this._status = RequestLoader.STATUS_ERROR;
                reject(Error("Network Error"));
            };

            this.request.send();
        });


    }

    public abort(): void
    {
        if (this.request)
            this.request.abort();
    }


}