export type ResponseObject = {
    success: boolean,
    type: string,
    form: string,
    message: string,
    aditional?: any
}

export class FormResponse {
    private form: string;
    constructor(form: string) {
        this.form = form
    }

    success(message: string, aditional?: any): ResponseObject {
        return {
            success: true,
            type: "Success",
            message: message,
            form: this.form,
            ...aditional
        }
    }

    error(message: string, aditional?: any): ResponseObject {
        return {
            success: false,
            type: "Error",
            message: message,
            form: this.form,
            ...aditional
        }
    }
}