/** @format */

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
      loadTree: action,
    });
  }

  async loadTree(rootId) {
    const tree = await getTree(rootId);
    this.tree = tree;
  }
}
