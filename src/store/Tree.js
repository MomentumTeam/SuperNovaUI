import { action, makeAutoObservable, observable } from 'mobx';
import { getTree } from '../service/TreeService';

export default class TreeStore {
  tree = [
    {
      label: '',
      expanded: false,
      children: [],
    },
  ];

  constructor() {
    makeAutoObservable(this, {
      tree: observable,
      loadTreeByEntity: action,
      loadTreeByOG: action,
    });
  }

  async loadTreeByEntity(entity) {
    const tree = await getTree(entity.directGroup);
    this.tree = tree;
  }

  async loadTreeByOG(rootId) {
    const tree = await getTree(rootId);
    this.tree = tree;
  }
}
