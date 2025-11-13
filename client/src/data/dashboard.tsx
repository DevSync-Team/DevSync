 import { Session, StatItem } from "@/types/dashboard.types";
import { FaCode, FaUsers, FaClock } from "react-icons/fa";
import { MdOutlinePlayCircle } from "react-icons/md";

export const stats: StatItem[] = [
  {
    label: "Total Sessions",
    value: "3",
    icon: <FaCode className="text-blue-600 text-xl" />,
    iconColor: "bg-blue-900/50"
  },
  {
    label: "Active Sessions",
    value: "1",
    icon: <MdOutlinePlayCircle className="text-green-600 text-xl" />,
    iconColor: "bg-green-900/50"
  },
  {
    label: "Collaborators",
    value: "6",
    icon: <FaUsers className="text-purple-600 text-xl" />,
    iconColor: "bg-purple-900/40"
  },
  {
    label: "Coding Time",
    value: "24h",
    icon: <FaClock className="text-orange-600 text-xl" />,
    iconColor: "bg-orange-900/40"
  },
];
 export const sessions:Session[] = [
    {
      name: "React Component Library",
      language: "Javascript",
      collaborators: 3,
      time: "1h ago",
      status: "Live",
    },
    {
      name: "API Backend Service",
      language: "Python",
      collaborators: 2,
      time: "2h ago",
      status: "Open",
    },
    {
      name: "Mobile App Logic",
      language: "Typescript",
      collaborators: 1,
      time: "1d ago",
      status: "Open",
    },
  ];
