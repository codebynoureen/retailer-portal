const invoices = [
 {
  id: "INV-2026-3312",
  amount: "PKR 84,500",
  status: "Overdue",
  dueDate: "2026-06-12",

  items: [
    {
      name: "Website Design",
      price: "PKR 50,000",
    },
    {
      name: "Hosting",
      price: "PKR 20,000",
    },
    {
      name: "Domain",
      price: "PKR 14,500",
    },
  ],
  payments: [
  {
    date: "5 June 2026",
    amount: "PKR 20,000",
    method: "Bank Transfer",
  },]
},
{
  id: "INV-2026-3340",
  amount: "PKR 1,16,800",
  status: "Partial",
  dueDate: "2026-06-24",

  items: [
    {
      name: "Mobile App Design",
      price: "PKR 80,000",
    },
    {
      name: "UI Kit",
      price: "PKR 36,800",
    },
  ],
  payments: [
  {
    date: "8 June 2026",
    amount: "PKR 10,000",
    method: "EasyPaisa",
  },]
},
 {
  id: "INV-2026-3298",
  amount: "PKR 1,12,400",
  status: "Paid",
  dueDate: "2026-06-18",

  items: [
    {
      name: "Logo Design",
      price: "PKR 40,000",
    },
    {
      name: "Brand Guidelines",
      price: "PKR 72,400",
    },
  ],
  payments: [
  {
    date: "10 June 2026",
    amount: "PKR 15,000",
    method: "JazzCash",
  },]
},
  {
  id: "INV-2026-3251",
  amount: "PKR 1,68,000",
  status: "Paid",
  dueDate: "2026-06-10",

  items: [
    {
      name: "E-commerce Website",
      price: "PKR 120,000",
    },
    {
      name: "Maintenance",
      price: "PKR 48,000",
    },
  ],
  payments: [
  {
    date: "9 June 2026",
    amount: "PKR 25,000",
    method: "Bank Transfer",
  },]
},
];
export default invoices;