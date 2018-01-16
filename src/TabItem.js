import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { observer } from "mobx-react/native";
import { Ionicons as Icon } from "@expo/vector-icons";
import P from "P";

@observer
export default class extends Component {
  render() {
    return (
      <TouchableOpacity
        disabled={this.props.disabled}
        style={styles.btn}
        activeOpacity={0.5}
        onPress={this.props.onPress}
      >
        <Icon name={this.props.iconName} style={styles.btnIcon} />
        <P style={styles.btnText}>{this.props.title}</P>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  btnIcon: {
    color: "white",
    fontSize: 24
  },
  btnText: {
    textAlign: "center",
    color: "white",
    fontSize: 11
  }
});
