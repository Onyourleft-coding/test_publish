const pcRoutes = {
  path: "/pc",
  name: "pc",
  meta: {
    navBar: false,
    title: "首页",
  },
  redirect: "/pc-student-evaluate",
  component: (resolve) => require(["../views/pc/layout"], resolve),

  children: [
    {
      path: "/pc-student-evaluate",
      name: "pcStudentEvaluate",
      meta: {
        navBar: false,
        title: "学生评价",
        hiddenMenu: false,
      },
      component: (resolve) =>
        require(["../views/pc/pc-student-evaluate"], resolve),
    },
    {
      path: "/pc-ranking-list",
      name: "pcRankingList",
      meta: {
        navBar: false,
        title: "排行榜",
        hiddenMenu: false,
      },
      component: (resolve) =>
        require(["../views/pc/pc-ranking-list"], resolve),
    },
    {
      path: "/pc-evaluation-record",
      name: "pcEvaluationRecord",
      meta: {
        navBar: false,
        title: "评价记录",
        hiddenMenu: false,
      },
      component: (resolve) =>
        require(["../views/pc/pc-evaluation-record"], resolve),
    },
    {
      path: "/pc-credit-detail",
      name: "pcCreditDetail",
      meta: {
        navBar: false,
        title: "评价详情",
        hiddenMenu: true,
      },
      component: (resolve) =>
        require(["../views/pc/pc-credit-detail"], resolve),
    },
    {
      path: "/pc-evaluate",
      name: "pcEvaluated",
      meta: {
        navBar: true,
        title: "点评",
        hiddenMenu: true,
      },
      component: (resolve) =>
        require(["../views/pc/pc-evaluate"], resolve),
    },
    {
      path: "/pc-third-target",
      name: "pcThirdTarget",
      meta: {
        navBar: true,
        title: "点评",
        hiddenMenu: true,
      },
      component: (resolve) =>
        require(["../views/pc/pc-third-target"], resolve),
    },
    {
      path: "/pc-add-group",
      name: "pcAddGroup",
      meta: {
        navBar: true,
        title: "编辑小组",
        hiddenMenu: true,
      },
      component: (resolve) =>
        require(["../views/pc/pc-add-group"], resolve),
    },
  ],
};
export default pcRoutes;
