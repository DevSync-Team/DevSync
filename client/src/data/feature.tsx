import { Feature } from "@/types/feature.types";
import { FaUsers, FaLock, FaCode } from "react-icons/fa"; // icons from Font Awesome

export const Features: Feature[] = [
  {
    icon: <FaUsers size={24} />,
    title: "Real-time Collaboration",
    description:
      "See changes instantly as your team codes together. Live cursors, real-time editing, and seamless synchronization.",
    color: "text-white",
    bg: "bg-blue-600",
  },
  {
    icon : <FaLock size={24} />,
    title: "Secure Execution",
    description:
      "Run your code safely in isolated environments. Built-in security ensures your projects and data stay protected.",
    color: "text-white",
    bg: "bg-green-600",
  },
  {
    icon: <FaCode  size={24}/>,
    title: "Multi-Language Support",
    description:
      "Support for 20+ programming languages with intelligent syntax highlighting and auto-completion.",
    color: "text-white",
    bg: "bg-purple-600",
  },
];
