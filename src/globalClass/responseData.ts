export class responseData<D>{
    Data: D | D[];
    satusCode: number;
    message: string;

    constructor(Data: D|D[], statusCode: number, message: string) {
        this.Data = Data;
        this.satusCode = statusCode;
        this.message = message;

        return this;
    }
}