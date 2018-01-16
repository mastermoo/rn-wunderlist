import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  Dimensions
} from "react-native";
import { observer } from "mobx-react/native";
import { Ionicons as Icon } from "@expo/vector-icons";
import P from "P";
import store from "./stores/todolist";
import TabItem from "./TabItem";

const { width } = Dimensions.get("window");

@observer
export default class extends Component {
  render() {
    return (
      <View style={styles.overlay} pointerEvents={"box-none"}>
        {store.dropdownActive && this._renderTappableBackground()}

        <Animated.View
          style={[
            styles.dropdowns,
            {
              transform: [
                {
                  translateY: store.dropdownAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [34 * store.dropdownOptions.length, 0]
                  })
                }
              ]
            }
          ]}
        >
          {store.dropdownOptions.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              disabled={this.props.disabled}
              style={styles.btn}
              activeOpacity={0.5}
              onPress={() => store.dropdownPressed(item.value)}
            >
              {false && (
                <Icon name={"ios-person-add-outline"} style={styles.btnIcon} />
              )}
              <P style={styles.btnText}>{item.title}</P>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </View>
    );
  }

  _renderTappableBackground() {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.overlay}
        onPress={() => store.hideDropdown()}
      />
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    justifyContent: "flex-end",
    top: 0,
    right: 0,
    bottom: 49,
    left: 0,
    backgroundColor: "transparent"
  },
  dropdowns: {
    backgroundColor: "#588d64"
  },
  btn: {
    alignItems: "center",
    flexDirection: "row",
    height: 46,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.33)",
    paddingHorizontal: 15
  },
  btnIcon: {
    color: "white",
    fontSize: 24,
    width: 45,
    textAlign: "center"
  },
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "300"
  }
});
