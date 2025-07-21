import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("products", "routes/products.tsx"),
  route("orders", "routes/orders.tsx"),
  route("customers", "routes/customers.tsx"),
  route("analytics", "routes/analytics.tsx"),
] satisfies RouteConfig;
