import React, { Component } from 'react';
import {
  AppRegistry,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import Order from './app/component/Order'
import LoginScreen from './app/component/LoginScreen'
import MenuScreen from './app/component/Menu'
import OrderList from './app/component/OrderList'
import TicketHeader from './app/component/settings/TicketHeader'
import TicketFooter from './app/component/settings/TicketFooter'
import Printer from './app/component/settings/Printer'
import Product from './app/component/settings/Product'
import ProductEdit from './app/component/settings/ProductEdit'
import ContactScreen from './app/component/Contact'
import './shim'


import realm from './app/models/realm'

const App = StackNavigator({
  // Menu: { screen: MenuScreen, navigationOptions: { header: null} },
  // Login: { screen: LoginScreen, navigationOptions: { header: null} },
  OrderList: { screen: OrderList, navigationOptions: { header: null} },
  Order: { screen: Order, navigationOptions: { header: null} },
  TicketHeader: { screen: TicketHeader, navigationOptions: { header: null} },
  TicketFooter: { screen: TicketFooter, navigationOptions: { header: null} },
  Printer: { screen: Printer, navigationOptions: { header: null} },
  Product: { screen: Product, navigationOptions: { header: null} },
  ProductEdit: { screen: ProductEdit, navigationOptions: { header: null} },
});

AppRegistry.registerComponent('xpos', () => App);
