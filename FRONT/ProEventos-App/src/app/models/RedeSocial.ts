import { Evento } from "./Evento";

export interface RedeSocial {
    Id: number;
    Nome: string;
    URL: string;
    EventoId: number;
    PalestranteId?: number;
}
