import { action, makeAutoObservable, observable } from "mobx";
import { getTree } from "../service/TreeService";

export default class TreeStore {
  tree = [
    {
      label: "ספיר",
      expanded: true,
      children: [
        {
          label: "יחידה 1",
          className: "style2",
          expanded: true,
          children: [
            {
              label: "יחידה 2",
            },
            {
              label: "יחידה 2",
            },
          ],
        },
        {
          label: "8200",
          expanded: true,
          children: [
            {
              label: "יחידה 2",
            },
            {
              label: "יחידה 2",
            },
          ],
        },
      ],
    },
  ];

  constructor() {
    makeAutoObservable(this, {
      tree: observable,
      loadTree: action,
    });
  }

  async loadTree() {
    this.tree = await getTree();
  }
}
