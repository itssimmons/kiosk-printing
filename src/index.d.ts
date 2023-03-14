export interface Catalog {
  id: string;
  name: string;
  price: number;
  preview: string;
}

export interface Order {
  id: string;
  quantity: number;
  order: Catalog;
}