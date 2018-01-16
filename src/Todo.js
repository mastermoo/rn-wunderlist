import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Alert
} from "react-native";
import { observer } from "mobx-react/native";
import { Ionicons as Icon } from "@expo/vector-icons";
import P from "P";
import SwipeableRow from "./shared/SwipeRow";
import store from "./stores/todolist";
import StarButton from "./StarButton";

@observer
export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pressedIn: false
    };
  }

  onCheckPressIn() {
    this.setState({ pressedIn: true });
  }

  onCheckPressOut() {
    this.setState({ pressedIn: false });
  }

  onComplete() {
    store.toggleCompleted(this.props.todo);
  }

  onStarred() {
    this.props.todo.toggleStarred();
  }

  onEdit() {
    store.openTodo(this.props.todo);
  }

  showDeleteAlert() {
    Alert.alert(`"${this.props.todo.title}" will be deleted forever.`, null, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: this.onDelete.bind(this)
      }
    ]);
  }

  onDelete() {
    store.deleteTodo(this.props.todo);
  }

  onTodoPressed() {
    if (this.props.todo.id === store.openId) return store.setOpenId(null);

    store.openTodo(this.props.todo);
  }

  render() {
    const { todo } = this.props;
    const checkmarkVisible = todo.completed || this.state.pressedIn;
    const selectedTodo = store.selectedTodo && store.selectedTodo.id == todo.id;

    return (
      <SwipeableRow
        shouldBounceOnMount={false}
        maxSwipeDistance={size * 2 + 6}
        swipeThreshold={size / 2}
        slideoutView={this.renderSlideoutView()}
        onSwipeEnd={() => store.setScrollable(true)}
        onSwipeStart={() => {
          store.resetOpenId();
          store.setScrollable(false);
        }}
        onOpen={() => store.setOpenId(todo.id)}
        isOpen={todo.id === store.openId}
      >
        <TouchableHighlight
          style={[
            styles.container,
            {
              backgroundColor: selectedTodo ? "#d6eeff" : "white"
            }
          ]}
          underlayColor={"#d6eeff"}
          activeOpacity={1}
          onPress={this.onTodoPressed.bind(this)}
        >
          <View style={[styles.wrap, { opacity: todo.completed ? 0.75 : 1 }]}>
            <TouchableOpacity
              style={styles.btn}
              activeOpacity={1}
              onPress={this.onComplete.bind(this)}
              onPressIn={this.onCheckPressIn.bind(this)}
              onPressOut={this.onCheckPressOut.bind(this)}
            >
              <View style={styles.checkbox}>
                {checkmarkVisible && (
                  <Icon name="ios-checkmark-outline" size={28} color="#555" />
                )}
              </View>
            </TouchableOpacity>

            <View style={styles.body}>
              <P
                numberOfLines={1}
                style={[styles.title, todo.completed && styles.checked]}
              >
                {todo.title}
              </P>
            </View>

            <StarButton todo={todo} />
          </View>
        </TouchableHighlight>
      </SwipeableRow>
    );
  }

  renderSlideoutView() {
    return (
      <View style={styles.swipeBtns}>
        <TouchableOpacity
          style={[styles.swipeBtn, styles.editBtn]}
          activeOpacity={0.9}
          onPress={this.onEdit.bind(this)}
        >
          <Icon name={"ios-create-outline"} style={styles.swipeIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.swipeBtn, styles.deleteBtn]}
          activeOpacity={0.9}
          onPress={this.showDeleteAlert.bind(this)}
        >
          <Icon name={"ios-trash-outline"} style={styles.swipeIcon} />
        </TouchableOpacity>
      </View>
    );
  }
}

const size = 50;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 2,
    marginBottom: 1,
    height: size,
    overflow: "hidden"
  },
  wrap: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row"
  },
  btn: {
    width: size,
    height: size,
    justifyContent: "center",
    alignItems: "center"
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#555",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingTop: 3
  },
  title: {
    color: "#111",
    fontSize: 16,
    backgroundColor: "transparent"
  },
  body: {
    flex: 1,
    justifyContent: "center"
  },
  checked: {
    textDecorationLine: "line-through",
    color: "#555"
  },
  swipeBtns: {
    width: size * 2,
    height: size - 6,
    top: 3,
    borderRadius: 3,
    alignSelf: "flex-end",
    flexDirection: "row",
    overflow: "hidden"
  },
  swipeBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  deleteBtn: {
    backgroundColor: "#ee3229"
  },
  editBtn: {
    backgroundColor: "#0f85d9"
  },
  swipeIcon: {
    fontSize: 24,
    color: "white"
  }
});
