import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { appName, gitConfig } from "./shared";
import { IconLinux } from "@public/icons/linux";
import { IconJs } from "@/public/icons/js";
import { IconGit } from "@/public/icons/git";
import { IconBlog } from "@/public/icons/blog";
import { NavTooltip } from "@/components/navbar-tooptip";
import Link from "next/link";
import { History } from "lucide-react";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: appName,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      {
        text: "Lpic-1",
        url: "/lpic1",
        type: "icon",
        secondary: false,
        icon: <IconLinux />,
      },
      {
        text: "FrontEnd",
        url: "/front",
        type: "icon",
        secondary: false,
        icon: <IconJs />,
      },
      {
        text: "Git",
        url: "/git",
        type: "icon",
        secondary: false,
        icon: <IconGit />,
      },
      {
        text: "Blog",
        url: "/blog",
        active: "nested-url",
        type: "icon",
        secondary: false,
        icon: <IconBlog />,
      },
      {
        text: "Changelog",
        url: "/changelog",
        active: "nested-url",
        type: "icon",
        secondary: false,
        icon: <History />,
      },
    ],
  };
}
