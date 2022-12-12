export class Utils {
    constructor() {
    }

    public static getQueryStringParam(url, param) {
        let reg = new RegExp('[?&]' + param + '=([^&#]*)', 'i');
        let string = reg.exec(url);
        console.log("access_token: ", url, string ? string[1] : null);
        return string ? string[1] : null;
    }
}