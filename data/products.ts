export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  quantity: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "Lays Classic 15g × 24",
    price: 3840,
    stock: 100,
    quantity: 4,
  },
  {
    id: 2,
    name: "Lays Masala 15g × 24",
    price: 3840,
    stock: 100,
    quantity: 0,
  },
  {
    id: 3,
    name: "Cheetos Crunchy 18g × 24",
    price: 4800,
    stock: 100,
    quantity: 2,
  },
  {
    id: 4,
    name: "Pepsi 250ml × 24",
    price: 3600,
    stock: 8,
    quantity: 0,
  },
  {
    id: 5,
    name: "Olpers Milk 1L × 12",
    price: 4800,
    stock: 100,
    quantity: 0,
  },
];

export default products;