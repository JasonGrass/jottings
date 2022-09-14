/**
 * @type {import('vitepress').UserConfig}
 */

import journalsSidebar from "./sidebar.journals";

const config = {
  base: "/jottings/",
  title: "jottings",
  // description: "Just playing around.",
  themeConfig: {
    siteTitle: "jottings",
    nav: [
      { text: "journals", link: "/journals/index", activeMatch: "/journals/" },
    ],
    sidebar: {
        "/journals/": generatorSidebarForJournals(),
      },
  },
};

function generatorSidebarForJournals() {
    return [
      {
        text: "README",
        items: [
          { text: "README", link: "/journals/index" },
        ],
      },
      {
        text: "JOURNALS",
        items: journalsSidebar,
      },
    ];
  }


export default config;
