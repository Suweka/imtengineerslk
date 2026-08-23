import { Testimonial } from "@/lib/types";

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    customerName: "Ruwan Fernando",
    rating: 5,
    quote:
      "IMT installed two split units at our home in Moratuwa within the promised three days. Clean work, and the team explained the warranty clearly.",
  },
  {
    id: "t2",
    customerName: "Anusha Wickramasinghe",
    rating: 5,
    quote:
      "Booked a gas refill through their WhatsApp number and got a call back within the hour. Straightforward service, fair pricing.",
  },
  {
    id: "t3",
    customerName: "Nadeesha Perera",
    rating: 4,
    quote:
      "Good range of inverter models and the sales staff didn't push us toward the most expensive option. Happy with our Daikin unit so far.",
  },
];

export const siteSettings = {
  phone: "0766644460",
  whatsapp: "0766644460",
  email: "imtengineersmd@gmail.com",
  headOfficeAddress: "59/A Panapitiya, Karandeniya",
  engineeringDeptAddress: "222 Egodauyana, Modara, Moratuwa",
  businessHours: {
    weekdays: "Mon-Fri 8:00am - 5:00pm",
    saturday: "Sat 8:00am - 1:00pm",
    sunday: "Closed",
  },
  freeDeliveryThreshold: 50000,
  foundedYear: 2006,
};
