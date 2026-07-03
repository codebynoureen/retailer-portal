export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

const orders: OrderItem[] = [
  {
    id: 1,
    name: "Lays Classic 15g × 24",
    quantity: 4,
    price: 3840,
  },
  {
    id: 2,
    name: "Cheetos Crunchy 18g × 24",
    quantity: 2,
    price: 4800,
  },
];

export default orders;