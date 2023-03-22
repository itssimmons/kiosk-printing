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

export interface Ticket {
  total: string;
  price: string;
  title: string;
  subtitle: string;
}
