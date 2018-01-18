import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Alert,
  Image,
  Keyboard,
  ScrollView,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { List, ListItem, FormLabel, Button, FormInput, FormValidationMessage } from "react-native-elements";
import DatePicker from 'react-native-datepicker';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import moment from 'moment';
import realm from '../models/realm'
import { printKitchen, printKitchen2, printTicket } from '../printData'
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';


const slideAnimation = new SlideAnimation({
  slideFrom: 'bottom',
});
let { height, width } = Dimensions.get('window');

export default class OrderDetail extends React.Component {

  constructor(props) {
    super(props);
    let orderId = this.props.navigation.state.params.orderId
    if (!Number.isInteger(orderId)) {
      alert("Order Id Error")
      return false
    }


    this.order = realm.objects('Order').filtered('id = ' + orderId)[0];

    this.addProduct = this.addProduct.bind(this);
    this.addProductGram = this.addProductGram.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this)
    this.ClosedOrder = this.ClosedOrder.bind(this)
    this.state = {
      basketTotalTtc: this.order.totalTtc,
      basketProducts: this.order.products,
      selectedCategory: realm.objects('Category').filtered('id > 0').length == 0 ? { id: 0 } : realm.objects('Category').filtered('id > 0').sorted('id')[0],
      selectedSubCategory: { id: 1 },
      dbCategory: realm.objects('Category'),
      dbSubCategory: realm.objects('SubCategory'),
      dbProduct: realm.objects('Product'),
      gram: '',
      kitchenPrinterIp:realm.objects('Printer')[1].ipAddress 
    }
  }


  selectProduct(product) {
    this.setState({ selectedProduct: product })
    if (!product.gram) {
      this.addProduct(product);
    }
    else {
      this.gramKeyboardDialog.show()
      this.refs.gram.focus()
    }
  }

  addProduct(product) {

    const prix = product.priceTtc
    realm.write(() => {
      realm.create('Order', {
        id: this.order.id,
        totalTtc: this.order.totalTtc + prix,
      }, true)
    })

    let productList = this.order.products;
    var productSame = productList.filter((p) => {
      return (p.id == product.id);
    })
    if (productSame.length == 0) {
      realm.write(() => {
        productList.push({
          id: product.id,
          code: product.code,
          name: product.name,
          quantity: 1,
          priceTtc: product.priceTtc,
          priceHt: product.priceHt,
          totalTtc: product.priceTtc,
          vatRate: product.vatRate,
          vatId: product.vatId,
          stockActivated: product.stockActivated,
          categoryId: product.categoryId,
          printKitchen: product.printKitchen,
          gram: false,
          deviceId: 1,
          addedAt: new Date(),
          color: product.color,
          type: product.type,
        });
      });
    } else {
      realm.write(() => {
        productSame[0].quantity += 1;
        productSame[0].totalTtc + product.priceTtc;
      });
    }

    this.setState({
      basketTotalTtc: this.order.totalTtc,
    })
    return prix;
  }

  addProductGram() {
    if (!parseFloat(this.state.gram)) return
    this.gramKeyboardDialog.dismiss()

    let product = this.state.selectedProduct

    const totalTtc = product.priceTtc * parseFloat(this.state.gram) / 100
    realm.write(() => {
      realm.create('Order', {
        id: this.order.id,
        totalTtc: this.order.totalTtc + totalTtc,
      }, true)
    })

    let productList = this.order.products;

    realm.write(() => {
      productList.push({
        id: product.id,
        code: product.code,
        name: product.name,
        quantity: parseFloat(this.state.gram),
        priceTtc: product.priceTtc,
        priceHt: product.priceHt,
        totalTtc: totalTtc,
        vatRate: product.vatRate,
        vatId: product.vatId,
        stockActivated: product.stockActivated,
        categoryId: product.categoryId,
        printKitchen: product.printKitchen,
        gram: true,
        deviceId: 1,
        addedAt: new Date(),
        color: product.color,
        type: product.type,
      });
    });
    this.setState({ gram: '' })
  }

  deleteProduct(index) {

    prix = this.state.basketProducts[index].totalTtc
    realm.write(() => {
      realm.create('Order', {
        id: this.order.id,
        totalTtc: this.order.totalTtc - prix,
      }, true)
    })

    this.setState({
      basketTotalTtc: this.order.totalTtc,
    })
    if (this.state.basketProducts[index].quantity <= 1) {
      realm.write(() => {
        this.state.basketProducts.splice(index, 1)
      })
    } else {
      realm.write(() => {
        this.state.basketProducts[index].quantity--;
      })
    }


    this.setState({
      basketProducts: this.state.basketProducts,
      basketTotalTtc: this.order.totalTtc,
    })
  }

  ClosedOrder() {
    realm.write(() => {
      realm.create('Order', {
        id: this.order.id,
        closed: true,
      }, true)
      // realm.delete(this.order);
    })

    const { navigate, goBack } = this.props.navigation;
    this.props.navigation.state.params.refresh();
    goBack()
  }


  updateTable() {
    var reg = new RegExp('^[0-9]+$');
    if (!reg.test(this.state.sitNumber)) { alert('桌号'); return }
    if (!reg.test(this.state.nbCustomer)) { alert('人数'); return }
    const { navigate } = this.props.navigation
    realm.write(() => {
      realm.create('Order', { id: this.order.id, table: this.state.sitNumber, nbCustomer: parseInt(this.state.nbCustomer) }, true)
    })
    Keyboard.dismiss();
    this.forceUpdate();
  }
  _renderItem = ({ item, index }) => {

    return (
      <View style={styles.containerBasket}>
        <View style={{ flexDirection: "row", flex: 1, borderWidth: 0, backgroundColor: 'white', padding: 5 }}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: 'center' }}>
            {/* todo:// 菜品*/}
            <Text style={{ flex: 1, color: 'black', fontSize: 18 }}>{item.name}</Text>
            <Text style={{ flex: 1, color: 'red', fontSize: 18 }}>{item.priceTtc.toFixed(2)}€</Text>
            <View style={{ flex: 1, flexDirection: "row", alignItems: 'center' }}>
              <Button
                buttonStyle={{ justifyContent: 'flex-end', backgroundColor: 'red', borderRadius: 100 }}
                raised
                color='white'
                title='-'
                onPress={() => { this.deleteProduct(index) }}
              />
              <Text style={{ color: 'black', fontSize: 18 }}>{item.quantity}</Text>
              <Button
                buttonStyle={{ justifyContent: 'flex-end', backgroundColor: 'red', borderRadius: 100 }}
                raised
                color='white'
                title='+'
                onPress={() => { this.addProduct(item) }}
              />
            </View>
          </View>

        </View>
      </View>
    )
  }


  render() {
    const { navigate, goBack } = this.props.navigation;



    let totalProducts = 0;
    for (var i = 0; i < this.order.products.length; i++) {
      totalProducts += this.order.products[i].quantity;
    }
    return (
      <View style={styles.container}>
        <View style={styles.containerOrderBack}>
          <View style={styles.navBarStyle}>
            <TouchableOpacity onPress={() => { goBack(); }} style={styles.backButton}>

              <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
                <Image
                  style={styles.backLeftArrowImg}
                  source={require('../../assets/img/back-left-arrow.png')}
                />
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>返回</Text>
              </View>
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>菜谱</Text>
            </View>
            <TouchableOpacity onPress={() => {
              navigate(
                'Order',
                {
                  orderId: this.order.id,
                  isRefresh: true,
                  refresh: () => {

                    this.order = realm.objects('Order').filtered('id = ' + this.order.id)[0];
                    this.setState({
                      basketProducts: this.order.products
                    })
                    this.forceUpdate();
                  }
                })
            }}
              style={styles.updateButton}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>加菜</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View tabLabel={"购物"} style={styles.tabLabelStyle2}>
          <View style={{ flex: 0.2, alignItems: 'flex-start', backgroundColor: '#e6ffe6' }}>
            <Text style={{ color: 'black', fontSize: 18 }}>订单号：{this.order.id}</Text>
            {/* <Text style={{color: 'black', fontSize: 15}}></Text> */}
            <Text style={{ color: 'black', fontSize: 18 }}>菜品数量：{totalProducts}       桌号：{this.order.table}         人数：{this.order.nbCustomer}</Text>
            <Text style={{ color: 'black', fontSize: 22, color: 'red' }}>金额：{this.order.totalTtc.toFixed(2)}€</Text>
          </View>
          <FlatList
            style={styles.FlatListBasket}
            data={this.state.basketProducts}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => index}
            extraData={this.state}
          />

          <View style={{ flex: 0.15, alignItems: 'center', }}>

            <View style={{ flex: 1, flexDirection: "row", alignItems: 'center' }}>
              {this.state.kitchenPrinterIp!='' && <Button
                buttonStyle={{ backgroundColor: 'red' }}
                large
                title='厨房'
                onPress={() => printKitchen({}, this.order)} />}
              <Button
                buttonStyle={{ backgroundColor: 'red' }}
                large
                title='桌号'
                onPress={() => {
                  this.keyboardDialog.show();
                }} />
              <Button
                buttonStyle={{ backgroundColor: 'red' }}
                large
                title='打印'
                onPress={() => {this.ClosedOrder(); printKitchen({}, this.order);}} />
            </View>
          </View>

        </View>

        <PopupDialog ref={(keyboardDialog) => { this.keyboardDialog = keyboardDialog; }}
          dismissOnTouchOutside={false}
          dialogAnimation={slideAnimation}
          onDismissed={() => this.refs.sitNumber.blur()} >

          <View style={{ justifyContent: 'space-around' }}>
            <View style={{ flexDirection: 'row', paddingTop: 5 }}>
              <Button
                buttonStyle={{ backgroundColor: 'red', width: width / 2.5 }}
                large
                title='取消'
                onPress={() => { this.keyboardDialog.dismiss(); }}
              />
              <Button
                buttonStyle={{ backgroundColor: 'red', width: width / 2.5 }}
                large
                title='确认'
                onPress={() => { this.keyboardDialog.dismiss(); this.updateTable(); }}

              />
            </View>
            <FormLabel>桌号</FormLabel>
            <FormInput
              onChangeText={(text) => this.setState({ sitNumber: text })}
              placeholder="桌号"
              defaultValue={this.state.sitNumber}
              keyboardType="numeric"
              ref='sitNumber'
            />
            <FormLabel>人数</FormLabel>
            <FormInput
              ref='nbCustomer'
              style={{ fontSize: 70, textAlign: 'center', flexDirection: 'row', flex: 1 }}
              placeholder="人数"
              keyboardType="numeric"
              defaultValue={this.state.nbCustomer}
              onChangeText={(text) => this.setState({ nbCustomer: text })}
            />
          </View>



        </PopupDialog>

      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  backButton: {
    alignItems: "flex-start",
    justifyContent: 'flex-start',
  },
  backLeftArrowImg: {
    height: 20,
    width: 20,
    tintColor: 'white',
  },

  contentContainer: {
    padding: 0,
    flex: 1,
    marginTop: -20,
  },
  //  navBar Header
  productContainer: {
    paddingBottom: 0,
    flex: 1,
    marginTop: -20
  },
  containerOrderBack: {
    padding: 0,
    backgroundColor: 'red'

  },

  topIcon: {
    height: 60,
    width: 60,
    tintColor: 'blue'
  },

  printBlock: {
    height: height / 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },


  tabLabelStyle: {
    flex: 1,
  },
  navBarStyle: {
    height: height / 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  tabLabelStyle2: {
    flex: 1,
    flexDirection: 'column',
  },
  ProImg: {
    height: 20,
    width: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    tintColor: 'black',
  },
  tabLabelStyle3: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },


  // navBar Category

  flatListProduct: {
    flex: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },

  flatListSubCategory: {
    flex: 1,
    flexDirection: 'column',
  },

  flatListCategory: {
    flex: 1,
    backgroundColor: 'white',
  },


  // Button Product

  product_empty: {
    width: width / 5,
    height: height / 9,
  },

  product: {
    width: width / 5,
    height: height / 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: "white",
    borderWidth: 1
  },

  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },

  // Button Menu

  menu_empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  menu: {
    flex: 1,
    height: width / 5.25,
    width: width / 5.00,
    alignItems: 'center',
    justifyContent: 'center',
  },

  menuSelected: {
    width: width / 5,
  },

  menuImg: {
    height: 20,
    width: 20,
  },

  categoryName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },

  // Button SubMenu

  subMenu: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedSubMenu: {
    width: width / 5,
  },

  subMenuText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },

  // style basket

  FlatListBasket: {
    flex: 1,
    backgroundColor: 'white',
  },

  cartProductName: {
    flex: 2,
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: "left"
  },

  cartProductPrice: {
    flex: 1,
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: "right"
  },

  containerBasket: {
    backgroundColor: 'red',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    width: width
  },

  containerOrderList: {
    flex: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteImg: {
    height: 40,
    width: 40,
  },

  paymentBlock: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonOk: {
    fontSize: 60,
    marginTop: 20,
    textAlign: "center",
  }
});

