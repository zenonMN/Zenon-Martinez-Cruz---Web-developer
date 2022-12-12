export class User{
    id: string | null;
    email: string;
    phone: string | null;
    status: string | null;
    type: string | null;
    acronym : string | null;
    name: string | null;
    avatar: string | null;

    constructor() {
        this.name=null;
        this.email="correo electrónico";
        this.id = null;
        this.phone = null;
        this.status = null;
        this.type = null;
        this.acronym = null;
        this.avatar = null;
    }

    public static getAcronym(name : string): string {
      if (name) {
        let matches = name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").match(/\b(\w)/g);
        if(!matches)
          matches = [];
        return matches.length > 1 ? matches[0] + matches[1] : matches[0];
      }
      return '';
    }
 }