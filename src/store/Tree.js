import { action, makeAutoObservable, observable } from 'mobx';
import { getTree } from '../service/TreeService';

export default class TreeStore {
  isTreeLoading = true;
  tree = [
    {
      label: '',
      expanded: true,
      children: [],
    },
  ];

  constructor() {
    makeAutoObservable(this, {
      tree: observable,
      isTreeLoading: observable,
      loadTreeByEntity: action,
      loadTreeByOG: action,
    });
  }

  async loadTreeByEntity(entity) {
    this.isTreeLoading = true;

    try {
      const tree = await getTree(entity.directGroup);
      this.tree = tree;
    } catch (error) {
      console.log('problem in fetching user tree');
    }

    this.isTreeLoading = false;
  }

  async loadTreeByOG(rootId) {
    const tree = await getTree(rootId);
    this.tree = { tree };
  }
}
