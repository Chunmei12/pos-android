import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Alert,
  Image,
  Button,
  ScrollView,
  FlatList,
  List,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';

import DatePicker from 'react-native-datepicker';
import ScrollableTabView, {DefaultTabBar } from 'react-native-scrollable-tab-view';
import moment from 'moment';
import realm from '../models/realm'
import {printKitchen, printTicket} from '../printData'
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import digitalSignature from '../digitalSignature'
import {OrderClass} from '../classObject';
//import I18n from 'react-native-i18n'
require('../translations');

const slideAnimation = new SlideAnimation({
  slideFrom: 'bottom',
});

let {height, width} = Dimensions.get('window');

class Order extends React.Component {
  constructor(props) {
    super(props);
    let orderId = this.props.navigation.state.params.orderId
    if (!Number.isInteger(orderId)) {
      alert("Order Id Error")
      return false
    }

    this.tableId = this.props.navigation.state.params.tableId ? this.props.navigation.state.params.tableId : 0 
    this.order = realm.objects('Order').filtered('id = ' + orderId)[0]
    this.orders = realm.objects('Order').sorted('id')

    this.addProduct = this.addProduct.bind(this)
    this.selectCategory = this.selectCategory.bind(this)
    this.selectSubCategory = this.selectSubCategory.bind(this)
    this.deleteProduct = this.deleteProduct.bind(this)
    this.finishOrder = this.finishOrder.bind(this)
    this.addStock = this.addStock.bind(this)
    this.reduceStock = this.reduceStock.bind(this)
    this.updateTablePrice = this.updateTablePrice.bind(this)
    this.addFinishedOrder = this.addFinishedOrder.bind(this)
    this.closeOrder = this.closeOrder.bind(this)
    this.addGrandTotalTicket = this.addGrandTotalTicket.bind(this)
    this.state = {
      basketTotalTtc: this.order.totalTtc,
      basketProducts: this.order.products,
      selectedCategory: realm.objects('Category').filtered('id = 1')[0],
      selectedSubCategory: {id: 1},
      dbCategory: realm.objects('Category'),
      dbSubCategory: realm.objects('SubCategory'),
      dbProduct: realm.objects('Product'),
      gram: ''
    }


    this.subCategory = [{position: 1, id: 0},
      {position: 2, id: 0},
      {position: 3, id: 0},
      {position: 4, id: 0},
      {position: 5, id: 0},
      {position: 6, id: 0},
      {position: 7, id: 0},
      {position: 8, id: 0}]

      this.product = [{id: 0, position: 1}, {id: 0, position: 2}, {id: 0, position: 3},
        {id: 0, position: 4}, {id: 0, position: 5}, {id: 0, position: 6},
        {id: 0, position: 7}, {id: 0, position: 8}, {id: 0, position: 9},
        {id: 0, position: 10}, {id: 0, position: 11}, {id: 0, position: 12},
        {id: 0, position: 13}, {id: 0, position: 14}, {id: 0, position: 15},
        {id: 0, position: 16}, {id: 0, position: 17}, {id: 0, position: 18},
        {id: 0, position: 19}, {id: 0, position: 20}, {id: 0, position: 21},
        {id: 0, position: 22}, {id: 0, position: 23}, {id: 0, position: 24}]

      }


      selectCategory(category) {
        this.setState({selectedCategory: category})

        
        // let subCategory = realm.objects('SubCategory').filtered('categoryId = ' + category.id)
        // if (subCategory.length) {
        //   let subCat = subCategory.sorted('position')[0]
        //   this.props.selectedSubCategoryId(subCat.id);
        //   this.setState({subCategoryPosition: subCat.position})
        // }
        // else {
        //   this.props.selectedSubCategoryId(0);
        //   this.setState({subCategoryPosition: 1})
        // }

      }

      selectSubCategory(subCategory) {
        this.setState({selectedSubCategory: subCategory})
      }

      selectProduct(product) {
        this.setState({selectedProduct: product})
        if (!product.gram) {
          this.addProduct(product, 1);
        }
        else {
          this.gramKeyboardDialog.show()
          this.refs.gram.focus()
        }
      }

      updateTablePrice() {
        if (this.order.type == 'sit' && this.tableId) {
          realm.write(() => {
            realm.create('Table', { id: this.tableId, totalTtc: this.order.totalTtc }, true);
          })
        }
      }

      addStock(prod, quantity) {
        if (prod.stockActivated) {
          let product = realm.objects('Product').sorted('id');
          let p = product.filtered('id = ' + prod.id)[0];
          if (p) {
            realm.write(() => {
              p.stockQuantity += quantity
            })
          }
        }
      }

      reduceStock(prod, quantity) {
        if (prod.stockActivated) {
          let product = realm.objects('Product').sorted('id');
          let p = product.filtered('id = ' + prod.id)[0];
          if (p) {
            realm.write(() => {
              p.stockQuantity -= quantity
            })
          }
        }
      }

      addProduct(product, quantity) {
        if (product.gram) { 
          quantity = quantity / 100
          this.gramKeyboardDialog.dismiss()
        }
        let order = this.order
        var discount = 0;
        if (order.discount) discount = order.discount;
        else if (product.discount > 0) discount = product.discount;
        var totalTtc = order.totalTtc + parseFloat(product.priceTtc) * quantity * (100 - discount) / 100;
        var totalHt = order.totalHt + parseFloat(product.priceHt) * quantity * (100 - discount) / 100;
        var totalDiscountTtc =  order.totalDiscountTtc + parseFloat(product.priceTtc) * quantity * discount / 100;
        var totalDiscountHt = order.totalDiscountHt + parseFloat(product.priceHt) * quantity * discount / 100;
        var totalHt1 = order.totalHt1;
        var totalHt2 = order.totalHt2;
        var totalHt3 = order.totalHt3;
        var totalTtc1 = order.totalTtc1;
        var totalTtc2 = order.totalTtc2;
        var totalTtc3 = order.totalTtc3;
      
        if (product.vatId == 1) {
          totalHt1 += parseFloat(product.priceHt) * quantity * (100 - discount) / 100;
          totalTtc1 += parseFloat(product.priceTtc) * quantity * (100 - discount) / 100;
        }
        else if (product.vatId == 2) {
          totalHt2 += parseFloat(product.priceHt) * quantity * (100 - discount) / 100;
          totalTtc2 += parseFloat(product.priceTtc) * quantity * (100 - discount) / 100;
        }
        else if (product.vatId == 3) {
          totalHt3 += parseFloat(product.priceHt) * quantity * (100 - discount) / 100;
          totalTtc3 += parseFloat(product.priceTtc) * quantity * (100 - discount) / 100;
        }
        
        var totalVat1 = totalTtc1 - totalHt1;
        var totalVat2 = totalTtc2 - totalHt2;
        var totalVat3 = totalTtc3 - totalHt3;
        var totalVat = totalVat1 + totalVat2 + totalVat3;
        
        realm.write(() => {
          realm.create('Order', {
            id: order.id,
            totalTtc: parseFloat(totalTtc),
            totalHt: parseFloat(totalHt),
            totalDiscountTtc: totalDiscountTtc ? totalDiscountTtc : 0,
            totalDiscountHt: totalDiscountHt ? totalDiscountHt : 0,
            totalHt1: totalHt1,
            totalHt2: totalHt2,
            totalHt3: totalHt3,
            totalTtc1: totalTtc1,
            totalTtc2: totalTtc2,
            totalTtc3: totalTtc3,
            totalVat1: totalVat1,
            totalVat2: totalVat2,
            totalVat3: totalVat3,
            totalVat: totalVat
          },true);
        })

        let productList = this.order.products;

        realm.write(() => {
          productList.push({
            id: product.id,
            code: product.code,
            name: product.name,
            quantity: product.gram ? parseFloat(this.state.gram) : quantity,
            priceTtc: product.priceTtc,
            priceHt: product.priceHt,
            totalTtc: product.priceTtc * quantity,
            vatRate: product.vatRate,
            vatId: product.vatId,
            stockActivated: product.stockActivated,
            categoryId: product.categoryId,
            printKitchen: product.printKitchen,
            gram: product.gram,
            deviceId: 2,
            addedAt: new Date(),
            color: product.color,
            type: product.type,
          });
        });

        this.setState({
          basketTotalTtc: this.order.totalTtc,
          gram: ''
        })

        this.updateTablePrice()
        
      }


      deleteProduct(index, quantity) {
        //this.addStock(this.state.basketProducts[index], 1)
        let product = this.state.basketProducts[index]
        if (product.gram) quantity = quantity / 100
        let order = this.order
        var discount = 0;
        if (order.discount) discount = order.discount;
        else if (product.discount > 0) discount = product.discount;
        var totalTtc = order.totalTtc - parseFloat(product.priceTtc) * quantity * (100 - discount) / 100;
        var totalHt = order.totalHt - parseFloat(product.priceHt) * quantity * (100 - discount) / 100;
        var totalHt1 = order.totalHt1;
        var totalHt2 = order.totalHt2;
        var totalHt3 = order.totalHt3;
        var totalTtc1 = order.totalTtc1;
        var totalTtc2 = order.totalTtc2;
        var totalTtc3 = order.totalTtc3;
        var totalDiscountTtc =  order.totalDiscountTtc - parseFloat(product.priceTtc) * quantity * discount / 100;
        var totalDiscountHt = order.totalDiscountHt - parseFloat(product.priceHt) * quantity * discount / 100;
        if (product.vatId == 1) {
          totalHt1 -= parseFloat(product.priceHt) * quantity * (100 - discount) / 100;
          totalTtc1 -= parseFloat(product.priceTtc) * quantity * (100 - discount) / 100;
        }
        else if (product.vatId == 2) {
          totalHt2 -= parseFloat(product.priceHt) * quantity * (100 - discount) / 100;
          totalTtc2 -= parseFloat(product.priceTtc) * quantity * (100 - discount) / 100;
        }
        else if (product.vatId == 3) {
          totalHt3 -= parseFloat(product.priceHt) * quantity * (100 - discount) / 100;
          totalTtc3 -= parseFloat(product.priceTtc) * quantity * (100 - discount) / 100;
        }
      
        var totalVat1 = totalTtc1 - totalHt1;
        var totalVat2 = totalTtc2 - totalHt2;
        var totalVat3 = totalTtc3 - totalHt3;
        var totalVat = totalVat1 + totalVat2 + totalVat3;
      
        realm.write(() => {
          realm.create('Order', {
            id: order.id,
            totalTtc: totalTtc,
            totalHt: totalHt,
            totalHt1: totalHt1,
            totalHt2: totalHt2,
            totalHt3: totalHt3,
            totalTtc1: totalTtc1,
            totalTtc2: totalTtc2,
            totalTtc3: totalTtc3,
            totalVat1: totalVat1,
            totalVat2: totalVat2,
            totalVat3: totalVat3,
            totalVat: totalVat,
            totalDiscountTtc:totalDiscountTtc,
            totalDiscountHt:totalDiscountHt,
          },
            true);
        })




        this.setState({
          basketTotalTtc: this.order.totalTtc,
        })

        realm.write(() => {
          this.state.basketProducts.splice(index, 1)
        })

        this.setState({
          basketProducts: this.state.basketProducts,
          basketTotalTtc: this.order.totalTtc,
        })

        this.updateTablePrice()
      }

      finishOrder_delete() {
          realm.write(() => {
            realm.create('Order', {...this.order, closed: true, finishedAt: new Date()}, true);
          })

          const { navigate, goBack } = this.props.navigation;
          goBack()
      }

      finishOrder(print = false, pop = false) {
        
        this.addFinishedOrder({...this.order, finishedAt: new Date(), typeDoc: 'Ticket'});
        this.addGrandTotalTicket();
        this.closeOrder(this.order.id);
      
        if (pop) {
          this.props.navigator.pop();
        } else {
          this.newOrder();
        }
      }

      newOrder() {
        var newOrder = new OrderClass(this.orders.length > 0? this.orders[this.orders.length - 1].id + 1 : 1,'bar');
        newOrder.table = 'C' + this.state.totalBar + 1;
        newOrder.userId = 1//this.props.currentUser.id
        newOrder.userName = 'Gerant'//this.props.currentUser.name
        newOrder.deviceId = 2;
        newOrder.appVersion = '1.9';
        newOrder.ticketHeaderId = 1;
        newOrder.ticketFooterId = 1;
        this.addOrder(newOrder);
        
        this.setState({
          leftToPay: 0,
          paid: 0,
          giveBack: 0,
          basketProducts: newOrder.products,
        });
      }

      addOrder(order) {
        let orders = realm.objects('Order').sorted('id');
        order.id = orders.length > 0 ? orders[orders.length - 1].id + 1 : 1;
        realm.write(() => {
          realm.create('Order', order);
        })
        this.order = order
        this.forceUpdate()
      };
      

      addFinishedOrder(order) {
        var config = realm.objects('Config')[0];
        let finishedOrders = realm.objects('FinishedOrder').sorted('id');
        var id = finishedOrders.length > 0 ? finishedOrders[finishedOrders.length - 1].id + 1 : 1;
        var isFirstSignature = finishedOrders.length > 0 ? 'O' : 'N';
        var previousSignature = finishedOrders.length > 0 ? finishedOrders[finishedOrders.length - 1].signature : null;
        var gdh = moment(order.finishedAt).format('YYYYMMDDHHmmss');
      
        var ttcVentillated = '';
        if (order.totalVat1 != 0) {
          ttcVentillated += order.totalTtc1.toFixed(2).replace('.', '') + order.vatRate1.toString().replace('.', '');
        }
        if (order.totalVat2 != 0) {
          ttcVentillated += order.totalTtc2.toFixed(2).replace('.', '') + order.vatRate2.toString().replace('.', '');
        }
        if (order.totalVat3 != 0) {
          ttcVentillated += order.totalTtc3.toFixed(2).replace('.', '') + order.vatRate3.toString().replace('.', '');
        }
      
        var data = id != 1 
                            ? ttcVentillated + ',' + order.totalTtc.toFixed(2).replace('.', '') + ',' + gdh + ',' + id + ',vente,'+ isFirstSignature + ',' + previousSignature 
                            : ttcVentillated + ',' + order.totalTtc.toFixed(2).replace('.', '') + ',' + gdh + ',' + id + ',vente,' + isFirstSignature;
        var signature = digitalSignature.sign(data);
      
        realm.write(() => {
          realm.create('FinishedOrder', {...order, 
                                            id: id,
                                            gdh: gdh,
                                            nbPrinted: 0,
                                            nbLine: order.products.length, 
                                            appVersion: config.appVersion,
                                            ticketFooterId: config.ticketFooterId,
                                            ticketHeaderId: config.ticketHeaderId,
                                            isFirstSignature: isFirstSignature,
                                            signature: signature, 
                                            previousSignature: previousSignature
                                           });
        })
      }

      closeOrder(id) {
        let orders = realm.objects('Order').sorted('id');
        var order = orders.filtered('id = ' + id);
        realm.write(() => {
          realm.create('Order', {id: id, closed: true, finishedAt: new Date()}, true);
        })
      };


      addGrandTotalTicket() {
        let grandTotalTicket = realm.objects('GrandTotalTicket').sorted('id');
        let finishedOrders = realm.objects('FinishedOrder').sorted('id');
        var gtt = finishedOrders[finishedOrders.length - 1];
        var grandTotalPerpetuel = grandTotalTicket.length > 0 ? grandTotalTicket[grandTotalTicket.length - 1].grandTotalPerpetuel : 0;
        var isFirstSignature = grandTotalTicket.length > 0 ? 'O' : 'N';
        let previousSignature = grandTotalTicket.length > 0 ? grandTotalTicket[grandTotalTicket.length - 1].signature : null;
        var gdh = moment(gtt.finishedAt).format("YYYYMMDDHHmmss");
      
        var ttcVentillated = '';
        if (gtt.totalVat1 != 0) {
          ttcVentillated += gtt.totalTtc1.toFixed(2).replace('.', '') + gtt.vatRate1.toString().replace('.', '');
        }
        if (gtt.totalVat2 != 0) {
          ttcVentillated += gtt.totalTtc2.toFixed(2).replace('.', '') + gtt.vatRate2.toString().replace('.', '');
        }
        if (gtt.totalVat3 != 0) {
          ttcVentillated += gtt.totalTtc3.toFixed(2).replace('.', '') + gtt.vatRate3.toString().replace('.', '');
        }
        
        var data = gtt.id > 1 ? ttcVentillated + ',' + gtt.totalTtc.toFixed(2).replace('.', '') + ',' + gdh  + ',' +  gtt.id  + ',' +  isFirstSignature  + ',' +  previousSignature
                                  : ttcVentillated + ',' + gtt.totalTtc.toFixed(2).replace('.', '') + ',' + gdh  + ',' +  gtt.id  + ',' +  isFirstSignature
        
        var signature = digitalSignature.sign(data);
      
        realm.write(() => {
          realm.create('GrandTotalTicket', {  id: gtt.id,
                                              ticketId: gtt.id,
                                              createdAt: gtt.finishedAt,
                                              gdh: gdh,
                                              grandTotal: gtt.totalTtc,
                                              grandTotalPerpetuel: grandTotalPerpetuel + Math.abs(gtt.totalTtc),
                                              isFirstSignature: isFirstSignature,
                                              signature: signature,
                                              previousSignature: previousSignature
                                          });
        })
      }
    
      

      _renderItem = ({item, index}) => {
        console.log(item)
        return (
          <View style={styles.containerBasket}>
            <View style={styles.containerOrderList}>
            <Text numberOfLines={1} style={[styles.cartProductQuantity]}>{item.gram ? '1  ' : item.quantity + '  '}</Text>
              <Text numberOfLines={1} style={[styles.cartProductName]}>{item.name}{item.gram ? ' (' + item.quantity + 'g)': ''}</Text>
              <Text numberOfLines={1} style={[styles.cartProductPrice]}>{item.totalTtc.toFixed(2)}</Text>
            </View>

            <TouchableOpacity onPress={() => this.deleteProduct(index, item.quantity)}>
            <Image
              style={styles.deleteImg}
              source={require('../../assets/img/delete.png')}
            />
            </TouchableOpacity>
          </View>
        )
      }


      render() {
        const { navigate, goBack } = this.props.navigation;

        let allProduct = []

        for (let i = 0, len = this.product.length; i < len; i++){

          let prod = this.state.dbProduct.filter((p) => {
            return (p.position == this.product[i].position &&
              p.categoryId == this.state.selectedCategory.id &&
              p.subCategoryId == this.state.selectedSubCategory.id
            )
          })

          if (prod.length == 0 || (prod[0].name == "" && prod[0].code == "")) {
            allProduct.push(
              <TouchableOpacity disabled={true} key={i} style={styles.product_empty}>
              </TouchableOpacity>
            )
          }
          else {
            allProduct.push(
              <TouchableOpacity  key={i} style={[styles.product, { backgroundColor: prod[0].color + 'E5' }]} onPress={() => this.selectProduct(prod[0])}>
                <Text style={styles.productName}>
                  {prod[0].code ? prod[0].code : prod[0].name}
                </Text>
              </TouchableOpacity>
            )
          }
        }

        let allCategory = []
        for (let i = 0; i < this.state.dbCategory.length; i += 1) {
          let category = this.state.dbCategory[i]
          if (category.name == "")
          allCategory.push(
            <TouchableOpacity key={i} style={styles.menu_empty}>
            </TouchableOpacity>
          )
          else {
            
            allCategory.push(
              <TouchableOpacity key={i} style={[styles.menu, category.id == this.state.selectedCategory.id && {backgroundColor: category.color + '99'}]} onPress={() => this.selectCategory(category)} >
                <Text style={[styles.categoryName, { color: category.color }, this.state.selectedCategory.id == category.id && { color: 'white'}]}> 
                  {category.name}
                </Text>
              </TouchableOpacity>
            )
          }
        }

        let allSubCategory = []
        for (let j = 0, len = this.subCategory.length; j < len; j += 1) {

          let subMenu = this.state.dbSubCategory.filter((sm) => { return (sm.categoryId == this.state.selectedCategory.id && sm.position == j + 1)})[0]
          if (typeof subMenu == 'undefined' || subMenu.name == '')
          allSubCategory.push(
            <TouchableOpacity key={j} disabled={true} style={[styles.subMenu, { backgroundColor: this.state.selectedCategory.color + '4D'}]}>
            </TouchableOpacity>
          )
          else {
            allSubCategory.push(
              <TouchableOpacity 
                key={j} 
                style={[styles.subMenu, { backgroundColor: this.state.selectedCategory.color + '4D'}, subMenu.id == this.state.selectedSubCategory.id && { backgroundColor: this.state.selectedCategory.color + '99'}]} 
                onPress={() => this.selectSubCategory(subMenu)} >
              <Text style={styles.subMenuText}> {subMenu.name}</Text>
              </TouchableOpacity>
            )
          }
        }

        return (
          <View style={styles.container}>
          {
            //  navBar Header
          }


          <ScrollableTabView
            style={{ backgroundColor: "black", paddingTop: height /30}}
            tabBarTextStyle={{fontSize: 22}}
            tabBarUnderlineStyle={{ backgroundColor: 'white'}}
            tabBarActiveTextColor={'white'}
            tabBarInactiveTextColor={'white'}
             >

            <View tabLabel={'Carte'} style={styles.tabLabelStyle}>

            <View style={[styles.flatListProduct, {backgroundColor: 'white'}]}>
              {allProduct}
            </View>

            <View style={styles.flatListSubCategory}>
              {allSubCategory}
            </View>

            <View style={styles.flatListCategory}>
              {allCategory}
            </View>

            </View>



            <View tabLabel={'Commande'} style={styles.tabLabelStyle2}>


              <View style={styles.printBlock}>
                <TouchableOpacity onPress={() => printKitchen({}, this.order)} style={styles.backLeftArrow}>
                  <Image
                  style={styles.topIcon}
                  source={require('../../assets/img/envoyer.png')}
                  />
                </TouchableOpacity>
                
                {/* <TouchableOpacity onPress={() => printTicket(realm.objects('Printer')[0], this.order)} style={styles.backLeftArrow}>
                  <Image
                  style={styles.topIcon}
                  source={require('../../assets/img/printer.png')}
                  />
                </TouchableOpacity> */}
              </View>
  


              <FlatList
                style={styles.FlatListBasket}
                data={this.state.basketProducts}
                renderItem={this._renderItem}
                keyExtractor={(item, index) => index}
                extraData={this.state}
              />

              <View style={{backgroundColor: 'white', height: 80}}>
                <Text style={{color: "black", fontWeight: 'bold', fontSize: 32}}>***{this.order.totalTtc.toFixed(2)}</Text>
              </View>

            </View>

            
          </ScrollableTabView>

          
          {/* <View style={{flexDirection: 'row', backgroundColor: "black"}}>
            <View style={styles.paymentBlock}>
                    <TouchableOpacity onPress={() => this.finishOrder()} style={styles.backLeftArrow}>
                      <Text style={{color: 'white', fontSize: 38}}>ESP</Text>
                    </TouchableOpacity>
            </View>
            <View style={styles.paymentBlock}>
                <TouchableOpacity onPress={() => this.finishOrder()} style={styles.backLeftArrow}>
                  <Text style={{color: 'white', fontSize: 38}}>CB</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.paymentBlock}>
                <TouchableOpacity onPress={() => this.finishOrder()} style={styles.backLeftArrow}>
                  <Text style={{color: 'white', fontSize: 38}}>TR</Text>
                </TouchableOpacity>
            </View>
          </View> */}


          <PopupDialog ref={(gramKeyboardDialog) => { this.gramKeyboardDialog = gramKeyboardDialog; }}
                      dialogAnimation={slideAnimation}
                      onDismissed={() => this.refs.gram.blur()} >
          
                <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                  <TextInput
                    ref='gram'
                    style={{fontSize: 70, textAlign: 'center', flexDirection: 'row', flex: 1}}
                    placeholder= "g"
                    keyboardType="numeric"
                    defaultValue={this.state.gram}
                    onChangeText={(text) => this.setState({gram: text})}
                  />
                  <TouchableOpacity onPress={() => this.addProduct(this.state.selectedProduct, this.state.gram)} style={{flex: 1, alignItems: 'center'}}>
                      <Text style={styles.buttonOk}>OK</Text>
                  </TouchableOpacity>
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

      //  navBar Header

      containerOrderBack: {
        backgroundColor: 'black',
      },

      topIcon: {
        height: 60,
        width: 60,
        tintColor: 'white'
      },

      printBlock: {
        height: height / 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
      },


      tabLabelStyle: {
        flex: 1,
        flexDirection: 'row',
      },

      tabLabelStyle2: {
        flex: 1,
        flexDirection: 'column',
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
        height: height / 9,
        width: width / 5,
      },

      product: {
        height: height / 9,
        width: width / 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: "white",
        borderWidth: 1
      },

      productName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        lineHeight: 18,
      },

      // Button Menu

      menu_empty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },

      menu: {
        flex: 1,
        height: height / 9,
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
        flex: 10,
        backgroundColor: 'white',
      },

      cartProductQuantity: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: "left"
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
        backgroundColor: 'white',
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

    Order.Produit = Order;

    export default Order;
