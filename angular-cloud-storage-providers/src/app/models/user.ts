export class User{
    id: string;
    email: string;
    phone: string;
    status: string;
    urlPicture: string;
    fullUrlPicture: string;
    type: string;
    lastActivity: number;
    acronym : string;
    name: string;

    constructor() {
        this.name="Usuario";
        this.email="correo electrónico";
    }

    public static getAcronym(name : string): string {
      if (name) {
        let matches = name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").match(/\b(\w)/g);
        return matches.length > 1 ? matches[0] + matches[1] : matches[0];
      }
      return '';
    }
 }