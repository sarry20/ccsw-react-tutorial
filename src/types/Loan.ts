import type { Game } from "./Game";
import type { Client } from "./Client";

export interface Loan {
  id: string;
  title: string;
  client?: Client;
  game?: Game;
  startDate: Date;
  endDate: Date;
}
export interface LoanResponse {
  content: Loan[];
  totalElements: number;
}
