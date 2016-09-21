import { action, computed, observable } from 'mobx';


export default class Todo {
  @observable id = undefined;
  @observable title = '';
  @observable starred = false;
  @observable position = 0;
  @observable created_at = undefined;
  @observable completed_at = null;

  constructor(title, position, starred=false) {
    this.id = Date.now();
    this.title = title;
    this.position = position;
    this.starred = starred;
    this.created_at = Date.now();
  }

  @computed get completed() {
    return !!this.completed_at;
  }
}