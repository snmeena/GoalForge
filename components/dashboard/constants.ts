import { Code2, Dumbbell, Cpu, BookOpen } from "lucide-react";
import { EngineType } from "@/components/dashboard/types";

export const QUICK_TEMPLATES = [
    {
        title: "100x LeetCode Sprint",
        desc: "Track daily problem-solving volume.",
        icon: Code2,
        color: "text-blue-500",
        prefill: { type: "volume" as EngineType, title: "100x LeetCode Sprint", target: "100", unit: "Problems" }
    },
    {
        title: "Hypertrophy Blueprint",
        desc: "Manage gym session consistency.",
        icon: Dumbbell,
        color: "text-amber-500",
        prefill: { type: "routine" as EngineType, title: "Hypertrophy Gym Blueprint", freq: 5 }
    },
    {
        title: "SaaS Launch Pipeline",
        desc: "Pace your development tasks in order.",
        icon: Cpu,
        color: "text-emerald-500",
        prefill: { type: "pipeline" as EngineType, title: "SaaS MVP Launch", tasks: [{ id: 1, text: "Database Schema" }, { id: 2, text: "Auth Setup" }, { id: 3, text: "Dashboard UI" }] }
    }
];

export const COMMUNITY_CHALLENGES = [
    {
        title: "75 Hard Mental Toughness",
        type: "routine" as EngineType,
        desc: "The ultimate discipline test. 2 workouts, 1 gallon water, 10 pages, no cheat meals.",
        icon: Dumbbell,
        color: "text-red-500"
    },
    {
        title: "LeetCode 50x15 Sprint",
        type: "volume" as EngineType,
        desc: "Solve 50 medium/hard data structure problems in 15 days. High intensity.",
        icon: Code2,
        color: "text-blue-500"
    },
    {
        title: "System Design Digest",
        type: "volume" as EngineType,
        desc: "Read and analyze 30 system design case studies this month.",
        icon: BookOpen,
        color: "text-emerald-500"
    }
];
