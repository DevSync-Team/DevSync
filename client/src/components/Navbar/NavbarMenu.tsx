import { sessions } from "@/data/dashboard";

export const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Editor", href: `/editor/${sessions[0].id}` },
  { name: "Signin", href: "/signin" },
];
