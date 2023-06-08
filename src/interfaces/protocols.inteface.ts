import {Token} from "./tokens.inteface";
import {Contract} from "./contracts.interface";

export interface Protocol {
    _id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    homeUrl: string;
    repositoryUrl: string;
    token: Token;
    contracts: Contract[];
}
