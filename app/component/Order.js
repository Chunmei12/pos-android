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
import {printKitchen, printKitchen2, printTicket} from '../printData'
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';

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


    this.order = realm.objects('Order').filtered('id = ' + orderId)[0]

    this.addProduct = this.addProduct.bind(this)
    this.addProductGram = this.addProductGram.bind(this)
    this.selectCategory = this.selectCategory.bind(this)
    this.selectSubCategory = this.selectSubCategory.bind(this)
    this.deleteProduct = this.deleteProduct.bind(this)
    this.finishOrder = this.finishOrder.bind(this)
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

        //this.initializeData()
      }


      initializeData() {
        if (!realm.objects('Product').length) {
          const testProduct = [
            {id: 1, name: "coca", priceTtc: 2.00, categoryId: 1, subCategoryId: 3, position: 4, color: '#FF4900', type: 'product'},
            {id: 2, name: "coca2", priceTtc: 2.40, categoryId: 1, subCategoryId: 3, position: 5, color: '#FF4900', type: 'product'},
            {id: 3, name: "coca3", priceTtc: 2.10, categoryId: 1, subCategoryId: 3, position: 6, color: '#FA5671', type: 'option'},
            {id: 4, name: "coca4", priceTtc: 5.00, categoryId: 1, subCategoryId: 3, position: 17, color: '#FF4900', type: 'product'},
            {id: 5, name: "coca5", priceTtc: 4.80, categoryId: 1, subCategoryId: 3, position: 18, color: "#FF4900", type: 'product'},
            {id: 5, name: "get27", priceTtc: 6.80, categoryId: 1, subCategoryId: 1, position: 24, color: '#FF4900', type: 'product'},
            {id: 6, name: "Tequila", priceTtc: 6.80, categoryId: 1, subCategoryId: 1, position: 1, color: '#FF4900', type: 'product'},
            {id: 7, name: "Margarita", priceTtc: 6.80, categoryId: 1, subCategoryId: 1, position: 2, color: '#FF4900', type: 'product'},
            {id: 8, name: "Ti'punch", priceTtc: 6.80, categoryId: 1, subCategoryId: 1, position: 3, color: '#FF4900', type: 'product'},
            {id: 9, name: "Sangria", priceTtc: 6.80, categoryId: 1, subCategoryId: 1, position: 4, color: '#FF4900', type: 'product'},
            {id: 10, name: "Planteur", priceTtc: 6.80, categoryId: 1, subCategoryId: 1, position: 7, color: '#FF4900', type: 'product'},
            {id: 10, name: "Wow", priceTtc: 6.80, categoryId: 1, subCategoryId: 1, position: 7, color: '#FF4900', type: 'product'},
          ]

          for (var i = 0; i < testProduct.length; i += 1) {
            let product = testProduct[i]
            let lastProductId = realm.objects('Product').length ? realm.objects('Product').sorted('id', true)[0].id + 1 : 1

            realm.write(() => {
              realm.create('Product', {
                id: lastProductId,
                name: product.name,
                categoryId: product.categoryId,
                subCategoryId: product.subCategoryId,
                color: product.color,
                position: product.position,
                type: product.type,
                priceTtc: product.priceTtc,
              })
            })
          }
        }

        if (!realm.objects('Category').length) {
          const testCategory = [
            {id: 1, name: "Boisson", color: "#AAAAAA", image: "1.png"},
            {id: 2, name: "Plat", color: "#AAAAAA", image: "1.png"},
            {id: 3, name: "Entree", color: "#AAAAAA", image: "2.png"},
            {id: 4, name: "cat4", color: "#AAAAAA", image: "3.png"},
            {id: 5, name: "", color: "#AAAAAA", image: "4.png"},
            {id: 6, name: "cat6", color: "#AAAAAA", image: "5.png"},
            {id: 7, name: "cat7", color: "#AAAAAA", image: "6.png"},
            {id: 8, name: "cat8", color: "#AAAAAA", image: "7.png"},
          ]

          for (var j = 0; j < testCategory.length; j += 1) {
            let dbCategory = testCategory[j]
            let lastCategoryId = realm.objects('Category').length ? realm.objects('Category').sorted('id', true)[0].id + 1 : 1

            realm.write(() => {
              realm.create('Category', {
                id: lastCategoryId,
                name: dbCategory.name,
                logo: 'logo',
              })
            })
          }
        }

        if (!realm.objects('SubCategory').length) {
          const testSubCategory = [
            {id: 1, name: "Aperitif", categoryId: 1, position: 1},
            {id: 2, name: "Digestif", categoryId: 1, position: 3},
            {id: 3, name: "Soda", categoryId: 1, position: 4},
            {id: 4, name: "Vin", categoryId: 1, position: 5},
            {id: 5, name: "Champagne", categoryId: 1, position: 6},
            {id: 6, name: "Eau", categoryId: 1, position: 8},

            {id: 9, name: "subcat2p1", categoryId: 2, position: 1},
            {id: 10, name: "subcat2p2", categoryId: 2, position: 3},
            {id: 11, name: "subcat2p3", categoryId: 2, position: 4},
          ]

          for (var l = 0; l < testSubCategory.length; l += 1) {
            let dbSubCategory = testSubCategory[l]
            let lastSubCategoryId = realm.objects('SubCategory').length ? realm.objects('SubCategory').sorted('id', true)[0].id + 1 : 1

            realm.write(() => {
              realm.create('SubCategory', {
                id: lastSubCategoryId,
                name: dbSubCategory.name,
                categoryId: dbSubCategory.categoryId,
                position: dbSubCategory.position,
              })
            })
          }
        }
      }


      selectCategory(category) {
        var subCategory = realm.objects('SubCategory').filtered('categoryId = ' + category.id)
        if (subCategory.length) {
          var subCat = subCategory.sorted('position')[0]
          this.setState({
            subCategoryPosition: subCat.position,
            selectedCategory: category,
            selectedSubCategory: subCat,
          })
        }
        else {
          this.setState({
            subCategoryPosition: 1,
            selectedCategory: category,
            selectedSubCategory: {id: 0},
          })
        }
        
      }

      selectSubCategory(subCategory) {
        this.setState({selectedSubCategory: subCategory})
      }

      selectProduct(product) {
        this.setState({selectedProduct: product})
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
        this.setState({gram: ''})
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

        realm.write(() => {
          this.state.basketProducts.splice(index, 1)
        })

        this.setState({
          basketProducts: this.state.basketProducts,
          basketTotalTtc: this.order.totalTtc,
        })
      }

      finishOrder() {
          realm.write(() => {
              realm.delete(this.order);
          })

          const { navigate, goBack } = this.props.navigation;
          goBack()
      }
      

      _renderItem = ({item, index}) => {
        console.log(item)
        return (
          <View style={styles.containerBasket}>
            <View style={styles.containerOrderList}>
              <Text numberOfLines={1} style={[styles.cartProductName]}>{item.name}{item.gram ? ' (' + item.quantity + 'g)': ''}</Text>
              <Text numberOfLines={1} style={[styles.cartProductPrice]}>{item.totalTtc.toFixed(2)}</Text>
            </View>

            <TouchableOpacity onPress={() => this.deleteProduct(index)}>
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
              <TouchableOpacity
              disabled={true}
              key={i}
              style={styles.product_empty}>
              </TouchableOpacity>
            )
          }
          else {
            let basket = 0
            allProduct.push(
              <TouchableOpacity  key={i} style={[styles.product, { backgroundColor: prod[0].color + 'E5' }]} onPress={() => this.selectProduct(prod[0])}>
                <Text numberOfLines={3} style={styles.productName}>
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
                <Text style={[styles.categoryName, { color: category.color },
                                this.state.selectedCategory.id == category.id && { color: 'white'}]}> {category.name}</Text>
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
            style={{ backgroundColor: "black", paddingTop: height / 22}}
            tabBarTextStyle={{fontSize: 22}}
            tabBarUnderlineStyle={{ backgroundColor: 'white'}}
            tabBarActiveTextColor={'white'}
            tabBarInactiveTextColor={'white'}
             >

            <View tabLabel="菜单" style={styles.tabLabelStyle}>

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



            <View tabLabel={"购物"} style={styles.tabLabelStyle2}>


              <View style={styles.printBlock}>
                <TouchableOpacity onPress={() => printKitchen({}, this.order)} style={styles.backLeftArrow}>
                  <Image
                  style={styles.topIcon}
                  source={require('../../assets/img/envoyer.png')}
                  />
                </TouchableOpacity>
                

                {/* <TouchableOpacity onPress={() => printKitchen2({}, this.order)} style={styles.backLeftArrow}>
                  <Image
                  style={styles.topIcon}
                  source={require('../../assets/img/envoyer.png')}
                  />
                </TouchableOpacity> */}

                <TouchableOpacity onPress={() => printTicket({}, this.order)} style={styles.backLeftArrow}>
                  <Image
                  style={styles.topIcon}
                  source={require('../../assets/img/printer.png')}
                  />
                </TouchableOpacity>
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




            <View tabLabel={"结算"} style={styles.tabLabelStyle3}>

              <View style={styles.paymentBlock}>
                  <TouchableOpacity onPress={() => this.finishOrder()} style={styles.backLeftArrow}>
                    <Text style={{color: 'white', fontSize: 38}}>{this.order.table} 结算</Text>
                  </TouchableOpacity>
              </View>
            </View>





          </ScrollableTabView>


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
                  <TouchableOpacity onPress={() => this.addProductGram()} style={{flex: 1, alignItems: 'center'}}>
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
        width : width / 5,
        height : height / 9,
      },

      product: {
        width : width / 5,
        height : height / 9,
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
        flex: 10,
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
