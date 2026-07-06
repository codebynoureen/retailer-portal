export interface OrderLineItem {
  name: string;
  quantity: number;
  price: number;
}

export interface PastOrder {
  id: string;
  date: string;
  status: "Delivered" | "Pending" | "Processing";
  items: OrderLineItem[];
  invoiceId?: string;
}

const orders: PastOrder[] = [
  {
    id: "ORD-2026-0142",
    date: "28 June 2026",
    status: "Delivered",
    items: [
      { name: "Lays Classic 15g × 24", quantity: 4, price: 3840 },
      { name: "Cheetos Crunchy 18g × 24", quantity: 2, price: 4800 },
    ],
  },
  {
    id: "ORD-2026-0138",
    date: "22 June 2026",
    status: "Pending",
    items: [{ name: "Olpers Milk 1L × 12", quantity: 3, price: 4800 }],
  },
  {
    id: "ORD-2026-0129",
    date: "15 June 2026",
    status: "Processing",
    items: [{ name: "Pepsi 250ml × 24", quantity: 5, price: 3600 }],
  },
];

export default orders;