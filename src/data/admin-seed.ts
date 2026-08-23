export type AdminOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  itemsSummary: string;
  total: number;
  fulfillment: "delivery" | "showroom-pickup";
  status: "new" | "contacted" | "confirmed" | "delivered_installed" | "cancelled";
  whatsappStatus: "pending" | "sent" | "failed";
  createdAt: string;
};

export type AdminServiceRequest = {
  id: string;
  type: string;
  customerName: string;
  phone: string;
  address: string;
  preferredDate: string;
  status: "new" | "contacted" | "confirmed" | "completed" | "cancelled";
  whatsappStatus: "pending" | "sent" | "failed";
  createdAt: string;
};

export const adminOrders: AdminOrder[] = [
  { id: "ord-1", orderNumber: "IMT-2026-0481", customerName: "Nuwan Perera", phone: "077 456 7890", itemsSummary: "Daikin 1.5HP Split, Midea 2.0HP Cassette", total: 355300, fulfillment: "showroom-pickup", status: "confirmed", whatsappStatus: "sent", createdAt: "2026-08-20T09:38:00" },
  { id: "ord-2", orderNumber: "IMT-2026-0480", customerName: "Ishara Gunawardena", phone: "071 222 3344", itemsSummary: "LG 1.5HP Dual Inverter AC", total: 139900, fulfillment: "delivery", status: "new", whatsappStatus: "failed", createdAt: "2026-08-20T08:12:00" },
  { id: "ord-3", orderNumber: "IMT-2026-0479", customerName: "Ramesh Kumar", phone: "076 555 1234", itemsSummary: "Panasonic 1.5HP Deluxe Inverter AC", total: 143900, fulfillment: "delivery", status: "delivered_installed", whatsappStatus: "sent", createdAt: "2026-08-19T14:02:00" },
  { id: "ord-4", orderNumber: "IMT-2026-0478", customerName: "Dilani Silva", phone: "070 888 9911", itemsSummary: "Daikin 1.0HP Inverter Split AC", total: 119900, fulfillment: "showroom-pickup", status: "contacted", whatsappStatus: "sent", createdAt: "2026-08-19T10:47:00" },
  { id: "ord-5", orderNumber: "IMT-2026-0477", customerName: "Kasun Jayawardena", phone: "077 333 6677", itemsSummary: "Midea 3.0HP Cassette AC", total: 349800, fulfillment: "delivery", status: "new", whatsappStatus: "failed", createdAt: "2026-08-18T17:22:00" },
];

export const adminServiceRequests: AdminServiceRequest[] = [
  { id: "svc-r-1", type: "Gas Refill", customerName: "Chamodi Rathnayake", phone: "077 111 2233", address: "12 Lake Road, Kandy", preferredDate: "2026-08-24", status: "new", whatsappStatus: "sent", createdAt: "2026-08-20T11:00:00" },
  { id: "svc-r-2", type: "Annual Maintenance Contract", customerName: "Fazal Hameed", phone: "076 222 4455", address: "8 Beach Road, Negombo", preferredDate: "2026-08-25", status: "contacted", whatsappStatus: "sent", createdAt: "2026-08-19T09:15:00" },
  { id: "svc-r-3", type: "Emergency Same-Day", customerName: "Priyanka Alwis", phone: "071 999 8877", address: "23 Temple Lane, Dehiwala", preferredDate: "2026-08-20", status: "confirmed", whatsappStatus: "sent", createdAt: "2026-08-20T07:40:00" },
];
