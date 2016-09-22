import _ from 'lodash';
import { Animated, Easing, Dimensions } from 'react-native';
import { action, computed, observable } from 'mobx';
import Todo from './todo';

const { width } = Dimensions.get('window');

const sortOptions = [
	{ title: 'Sort Alphabetically', value: 'title' },
	{ title: 'Sort by Creation Date', value: 'created_at' },
	{ title: 'Sort by Priority', value: 'starred' },
];

const optionsMap = {
	share: [],
	sort: sortOptions,
	more: []
};

class List {
	@observable loaded = false;
	@observable scrollable = true;
	@observable openId = null;
	
	@observable todos = [];
	@observable refreshing = false;
	@observable completedVisible = false;
	@observable sortBy = 'created_at';
	@observable orderBy = 'asc';

	@observable selectedDropdownItem = '';
	@observable dropdownOptions = [];
	@observable dropdownAnim = new Animated.Value(0);

	@observable detailAnim = new Animated.Value(0);
	@observable selectedTodo = null;

	constructor() {
		this.addTodo('Write some code');
		setTimeout(() => this.addTodo('Publish to Exponent'), 10);
		setTimeout(() => this.addTodo('Write a Medium Story', true), 20);
	}

	@action addTodo(title, starred=false) {
		const todo = new Todo(title, this.highestPosition + 1, starred);
		this.todos.push(todo);
	}

	@action refresh() {
		this.refreshing = true;
		setTimeout(() => this.refreshing = false, 1000);
	}

	@action toggleCompletedTodos() {
		this.completedVisible = !this.completedVisible;
	}

	@action tabItemPressed(item) {
		if (item == this.selectedDropdownItem) return this.hideDropdown();

		const options = optionsMap[item];
		this.selectedDropdownItem = item;
		this.dropdownOptions = options;
		this.animateDropdown(1);
	}

	@action animateDropdown(toValue, cb=null) {
		Animated.timing(this.dropdownAnim, {
			toValue,
			duration: 150,
		}).start(cb);
	}

	@action dropdownPressed(value) {
		if (this.selectedDropdownItem == 'sort') {
			if (this.sortBy == value) {
				var sorted = _.reverse(this.openTodos);
			} else {
				this.sortBy = value;
				var sorted = _.sortBy(this.openTodos, this.sortBy);
			}

			this.openTodos.forEach((todo) => {
				todo.position = sorted.indexOf(todo);
			});
		}
	}

	@action hideDropdown() {
		return this.animateDropdown(0, () => {
			this.selectedDropdownItem = '';
			this.dropdownOptions = [];
		});
	}

	@action toggleCompleted(todo) {
    if (!!todo.completed_at) {
    	todo.position = this.lowestPosition - 1;
      todo.completed_at = null;
    } else {
      todo.completed_at = Date.now();
      todo.starred = false;
    }
  }

	@action deleteTodo(deleteableTodo) {
		this.todos = this.todos.filter(todo => todo.id != deleteableTodo.id);
	}

	@action toggleStarred(todo) {
		if (todo.starred) return todo.starred = false;

		todo.starred = true;
		todo.position = this.highestPosition + 1;
  }

	@action openTodo(selectedTodo) {
		this.selectedTodo = selectedTodo;
		this.resetOpenId();
		requestAnimationFrame(this.openDetail.bind(this));
	}

	@action resetOpenId() {
		if (this.openId) this.openId = null;
	}

	@action openDetail() {
		Animated.timing(this.detailAnim, {
			toValue: width,
			duration: 220,
			easing: Easing.easeInEaseOut,
		}).start();
	}

	@action closeDetail() {
		Animated.timing(this.detailAnim, {
			toValue: 0,
			duration: 220,
			easing: Easing.easeInEaseOut,
		}).start(() => this.selectedTodo = null);
	}

	@action setOpenId(openId) {
		this.openId = openId;
	}

	@action setScrollable(scrollable) {
		this.scrollable = scrollable;
	}

	@computed get openTodos() {
		return _.sortBy(this.todos.filter(todo => !todo.completed_at), 'position');
	}

	@computed get lowestPosition() {
		if (this.openTodos.length <= 0) return 0;
		return this.openTodos[0].position;
	}

	@computed get highestPosition() {
		if (this.openTodos.length <= 0) return 0;
		return this.openTodos[this.openTodos.length - 1].position;
	}

	@computed get completedTodos() {
		return _.sortBy(this.todos.filter(todo => !!todo.completed_at), 'completed_at');
	}

	@computed get dropdownActive() {
		return this.selectedDropdownItem != '';
	}
}

export default new List();
