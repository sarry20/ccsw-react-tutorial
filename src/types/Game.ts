import type { Category } from "./Category";
import type { Author } from "./Author";

export interface Game {
  id: string;
  title: string;
  age: number;
  category?: Category;
  author?: Author;
}
