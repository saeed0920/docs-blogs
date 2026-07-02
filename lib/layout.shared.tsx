import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { appName, gitConfig } from "./shared";

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
      },
      {
        text: "FrontEnd",
        url: "/front",
      },
      {
        text: "Git",
        url: "/git",
      },
      {
        text: "Blog",
        url: "/blog",
        active: "nested-url",
        secondary: false,
      },
    ],
  };
}
