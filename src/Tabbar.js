import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { observer } from "mobx-react/native";
import { Ionicons as Icon } from "@expo/vector-icons";
import store from "./stores/todolist";
import TabItem from "./TabItem";

export default () => (
  <View style={styles.container}>
    <View style={styles.wrap}>
      <TabItem
        iconName={"ios-person-add-outline"}
        title={"Share"}
        onPress={() => store.tabItemPressed("share")}
        disabled
      />
      <TabItem
        iconName={"ios-swap-outline"}
        title={"Sort"}
        onPress={() => store.tabItemPressed("sort")}
      />
      <TabItem
        iconName={"ios-more-outline"}
        title={"More"}
        onPress={() => store.tabItemPressed("more")}
        disabled
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: 49
  },
  wrap: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#588d64"
  }
});
