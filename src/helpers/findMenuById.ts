import entireMenu from "../assets/menu.json";
import type { Catalog } from "..";

export const findMenuById = (id: string) => {
  return entireMenu.find(catalog => catalog.id === id) as Catalog;
};
