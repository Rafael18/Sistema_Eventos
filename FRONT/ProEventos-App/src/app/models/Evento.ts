import { Lote } from "./Lote";
import { Palestrante } from "./Palestrante";
import { RedeSocial } from "./RedeSocial";

export interface Evento {
    id: number;
    local: string;
    dataevento?: Date;
    tema: string;
    qtdpessoas: number;
    imagemurl: string;
    telefone: string;
    email: string;
    lotes: Lote[];
    redessociais: RedeSocial[];
    palestranteseventos: Palestrante[];
}
