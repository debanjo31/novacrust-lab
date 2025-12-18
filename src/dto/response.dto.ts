export class ResponseDto {
    constructor(
        public status: "error" | "success",
        public message: string,
        public data?: any,
        public errorCode?: string
    ) { }

    static error(message: string, data?: any, errorCode?: string) {
        return new ResponseDto("error", message, data, errorCode);
    }

    static success(message: string, data?: any) {
        return new ResponseDto("success", message, data);
    }
}   