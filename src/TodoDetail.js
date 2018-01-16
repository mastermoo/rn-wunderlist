import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  TouchableOpacity,
  PanResponder,
  TextInput
} from "react-native";
import P from "P";
import { observer } from "mobx-react/native";
import { Ionicons as Icon } from "@expo/vector-icons";
import store from "./stores/todolist";
import StarButton from "./StarButton";

const { width } = Dimensions.get("window");

@observer
export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      height: 0
    };
  }

  componentWillMount() {
    this.pan = store.detailAnim;

    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return gestureState.dx > 5;
      },

      onPanResponderGrant: (e, gestureState) => {
        this.pan.setOffset(this.pan._value);
        this.pan.setValue(0);
        // this.refs.input.blur();
      },

      onPanResponderMove: (e, { dx }) => {
        if (dx < 0) return;
        this.pan.setValue(-dx);
      },

      onPanResponderRelease: (e, { dx }) => {
        this.pan.flattenOffset();
        if (dx > 100) return store.closeDetail();
        store.openDetail();
      }
    });
  }

  validateTitle() {}

  render() {
    const todo = store.selectedTodo;

    if (!todo) return <View style={styles.container} />;

    return (
      <Animated.View
        {...this._panResponder.panHandlers}
        style={[
          styles.container,
          {
            transform: [
              {
                translateX: this.pan.interpolate({
                  inputRange: [0, width],
                  outputRange: [width, 0]
                })
              }
            ]
          }
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              // this.refs.input.blur();
              store.closeDetail();
            }}
            activeOpacity={0.75}
            style={styles.backBtn}
          >
            <Icon
              name={"ios-arrow-round-back-outline"}
              style={styles.backBtnIcon}
            />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            {false && (
              <TextInput
                ref={"input"}
                style={[
                  styles.title,
                  { height: Math.max(54, this.state.height) }
                ]}
                value={todo.title}
                multiline={true}
                onChangeText={title => (store.selectedTodo.title = title)}
                returnKeyType={"done"}
                onContentSizeChange={event => {
                  this.setState({
                    height: event.nativeEvent.contentSize.height
                  });
                }}
                blurOnSubmit={true}
                onSubmitEditing={this.validateTitle.bind(this)}
              />
            )}
            <P style={styles.title}>{todo.title}</P>
          </View>

          <StarButton todo={todo} />
        </View>
      </Animated.View>
    );
  }
}

const navbarHeight = 80 - 20;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 20,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#fafafa",
    transform: [
      {
        translateX: width
      }
    ]
  },

  header: {
    minHeight: navbarHeight,
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
    flexDirection: "row"
  },
  backBtn: {
    width: 50,
    height: navbarHeight,
    alignItems: "center",
    justifyContent: "center"
  },
  backBtnIcon: {
    color: "#555",
    fontSize: 34
  },
  title: {
    paddingVertical: 16,
    fontSize: 20,
    color: "black"
  }
});
