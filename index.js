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
  Menu: { screen: MenuScreen, navigationOptions: { header: null} },
  Login: { screen: LoginScreen, navigationOptions: { header: null} },
  Order: { screen: Order, navigationOptions: { header: null} },
  OrderList: { screen: OrderList, navigationOptions: { header: null} },
  TicketHeader: { screen: TicketHeader, navigationOptions: { header: null} },
  TicketFooter: { screen: TicketFooter, navigationOptions: { header: null} },
  Printer: { screen: Printer, navigationOptions: { header: null} },
  Product: { screen: Product, navigationOptions: { header: null} },
  ProductEdit: { screen: ProductEdit, navigationOptions: { header: null} },
});

let categories = realm.objects('Category');
if (categories.length == 0) {

  for (i = 0; i < 8; i++) {
    realm.write(() => {
      realm.create('Category', {
        id: i + 1,
      });
    });
  }

  realm.write(() => {
    realm.create('Category', { id: 1, name: 'Carte' }, true);
  })

}

let Vats = realm.objects('Vat');
if (Vats.length == 0) {
  realm.write(() => {
    realm.create('Vat', { "id": 1, "pourcentage": 5.50 })
    realm.create('Vat', { "id": 2, "pourcentage": 10.00 })
    realm.create('Vat', { "id": 3, "pourcentage": 20.00 })
  });
}


let subCategories = realm.objects('SubCategory');
if (subCategories.length == 0) {

  for (i = 0; i < 64; i++) {
    realm.write(() => {
      realm.create('SubCategory', {
        id: i + 1,
        categoryId:  Math.floor(i / 8) + 1,
        position: (i % 8) + 1,
      });
    });
  }

}

AppRegistry.registerComponent('xpos', () => App);
