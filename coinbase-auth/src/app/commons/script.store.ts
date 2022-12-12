import { environment } from '../../environments/environment';

interface Scripts {
    name: string;
    src: string;
}

export const Scriptstore: Scripts[] = [
    {name: 'HomeScript', src: "../../assets/js/home-scripts.js"}
];
