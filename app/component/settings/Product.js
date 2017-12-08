import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Image,
  ScrollView,
  List,
  TouchableOpacity,
  Dimensions,
  Alert,
  Button,
  FlatList,
  TouchableHighlight,
  Modal,
} from 'react-native';

import DatePicker from 'react-native-datepicker';
import { TabNavigator } from "react-navigation";
import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';
import moment from 'moment';
import realm from '../../models/realm'
import PopupDialog, {SlideAnimation} from 'react-native-popup-dialog';

let {height, width} = Dimensions.get('window');
const slideAnimation = new SlideAnimation({
  slideFrom: 'bottom',
});

export default class Product  extends React.Component {
  constructor(props) {
    super(props);

    this.updateUI = this.updateUI.bind(this)
    this.selectCategory = this.selectCategory.bind(this)
    this.selectSubCategory = this.selectSubCategory.bind(this)
    this.selectProduct = this.selectProduct.bind(this)
    this.updateCategory = this.updateCategory.bind(this)
    this.updateSubCategory = this.updateSubCategory.bind(this)
    this.showForm = this.showForm.bind(this)
    this.state = {
      dbCategory: realm.objects('Category'),
      dbSubCategory: realm.objects('SubCategory'),
      dbProduct: realm.objects('Product'),
      settings: false,
      selectedProduct: {priceTtc: 0},
      selectedCategory: realm.objects('Category').filtered('id = 1')[0],
      selectedSubCategory: realm.objects('SubCategory').filtered('id = 1')[0],
    }

    realm.addListener('change', this.updateUI);

    this.subCategory = [{position: 1, id: 0},
      {position: 2, id: 0},
      {position: 3, id: 0},
      {position: 4, id: 0},
      {position: 5, id: 0},
      {position: 6, id: 0},
      {position: 7, id: 0},
      {position: 8, id: 0}]

    this.product = [{id: 0, name: '', code: '', position: 1, priceTtc: 0, gram: false, printKitchen: true}, 
      {id: 0, name: '', code: '', position: 2, priceTtc: 0, gram: false, printKitchen: true},
      {id: 0, name: '', code: '', position: 3, priceTtc: 0, gram: false, printKitchen: true},
      {id: 0, name: '', code: '', position: 4, priceTtc: 0, gram: false, printKitchen: true},
      {id: 0, name: '', code: '', position: 5, priceTtc: 0, gram: false, printKitchen: true},
      {id: 0, name: '', code: '', position: 6, priceTtc: 0, gram: false, printKitchen: true},
      {id: 0, name: '', code: '', position: 7, priceTtc: 0, gram: false, printKitchen: true},
      {id: 0, name: '', code: '', position: 8, priceTtc: 0, gram: false, printKitchen: true},
      {id: 0, name: '', code: '', position: 9, priceTtc: 0, gram: false, printKitchen: true},
      {id: 0, name: '', code: '', position: 10, priceTtc: 0, gram: false, printKitchen: true},
      {id: 0, name: '', code: '', position: 11, priceTtc: 0, gram: false, printKitchen: true},
      {id: 0, name: '', code: '', position: 12, priceTtc: 0, gram: false, printKitchen: true},
      {id: 0, name: '', code: '', position: 13, priceTtc: 0, gram: false, printKitchen: true},
      {id: 0, name: '', code: '', position: 14, priceTtc: 0, gram: false, printKitchen: true},
      {id: 0, name: '', code: '', position: 15, priceTtc: 0, gram: false, printKitchen: true},
      {id: 0, name: '', code: '', position: 16, priceTtc: 0, gram: false, printKitchen: true},
      {id: 0, name: '', code: '', position: 17, priceTtc: 0, gram: false, printKitchen: true},
      {id: 0, name: '', code: '', position: 18, priceTtc: 0, gram: false, printKitchen: true},
      {id: 0, name: '', code: '', position: 19, priceTtc: 0, gram: false, printKitchen: true},
      {id: 0, name: '', code: '', position: 20, priceTtc: 0, gram: false, printKitchen: true},
      {id: 0, name: '', code: '', position: 21, priceTtc: 0, gram: false, printKitchen: true},
      {id: 0, name: '', code: '', position: 22, priceTtc: 0, gram: false, printKitchen: true},
      {id: 0, name: '', code: '', position: 23, priceTtc: 0, gram: false, printKitchen: true},
      {id: 0, name: '', code: '', position: 24, priceTtc: 0, gram: false, printKitchen: true}, ]
  }

    componentWillUnmount() {
      realm.removeAllListeners();    
    }
  
    updateUI() {
      this.setState({
        selectedProduct: {priceTtc: 0},
        dbCategory: realm.objects('Category'),
        dbSubCategory: realm.objects('SubCategory'),
        dbProduct: realm.objects('Product'),
      })
    }


    selectCategory(category) {
      
      var subCategory = realm.objects('SubCategory').filtered('categoryId = ' + category.id)
      if (subCategory.length) {
        var subCat = subCategory.sorted('position')[0]
        this.setState({
          subCategoryPosition: subCat.position,
          selectedCategory: category,
          selectedSubCategory: subCat,
          showPopupProduct: false,
          showPopupSubCategory: false,
          showPopupCategory: true
        })
      }
      else {
        this.setState({
          subCategoryPosition: 1,
          selectedCategory: category,
          selectedSubCategory: {id: 0},
          showPopupProduct: false,
          showPopupSubCategory: false,
          showPopupCategory: true
        })
      }
    }

    selectSubCategory(subCategory) {
      this.setState({
        selectedSubCategory: subCategory,
        showPopupProduct: false,
        showPopupSubCategory: true,
        showPopupCategory: false
      })
    }

    selectProduct(product) {
      
      this.setState({
        selectedProduct: product,
        showPopupProduct: true,
        showPopupSubCategory: false,
        showPopupCategory: false,
      })

      this.forceUpdate()
    } 
    
    updateCategory(newName) {
      realm.write(() => {
        realm.create('Category', {
          id: this.state.selectedCategory.id,
          name: newName,
        }, true)
      })
    }

    updateSubCategory(newName) {
      realm.write(() => {
        realm.create('SubCategory', {
          id: this.state.selectedSubCategory.id,
          name: newName,
        }, true)
      })
    }

    showForm() {
      if (this.state.showPopupProduct) {
        const { navigate } = this.props.navigation;
        navigate('ProductEdit', {
          product: this.state.selectedProduct,
          category: this.state.selectedCategory,
          subCategory: this.state.selectedSubCategory
        })
        
      }
      else {
        this.productDialog.show()
      }
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

        if (prod.length == 0) {
          allProduct.push(
            <TouchableOpacity key={i}
                              style={[styles.product_empty]}
                              onPress={() => this.selectProduct(this.product[i])}>
              <View style={[styles.productViewEmpty, { backgroundColor: '#FFFFFF4D' }]}>
                <Text numberOfLines={3} style={styles.productName}>+</Text>
              </View>
            </TouchableOpacity>
          )
        }
        else {
          let basket = 0
          allProduct.push(
            <TouchableOpacity  key={i} style={[styles.product, { backgroundColor: prod[0].color + 'E5' }]} onPress={() => this.selectProduct(prod[0])}>
              <Text numberOfLines={3} style={styles.productName}>
                {prod[0].code ? prod[0].code :prod[0].name}
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
          <TouchableOpacity key={i} 
                            style={styles.menu_empty}
                            onPress={() => this.selectCategory(category)} >
            <Text style={[styles.categoryName, { color: 'black' }]}>+</Text>
          </TouchableOpacity>
        )
        else {
          
          allCategory.push(
            <TouchableOpacity key={i} 
                              style={[styles.menu, category.id == this.state.selectedCategory.id && {backgroundColor: category.color + '99'}]} 
                              onPress={() => this.selectCategory(category)} >
            {/* <Image
            style={styles.menuImg}
            source={require('../../assets/img/printer.png')}
            /> */}
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
          <TouchableOpacity 
            key={j}
            style={[styles.subMenu, { backgroundColor: this.state.selectedCategory.color + '4D'}]}
            onPress={() => this.selectSubCategory(subMenu)} >
            <Text style={styles.subMenuText}>+</Text>
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
          // Modal
        }
          <View style={styles.containerOrderBack}>
            <View style={styles.navBarStyle}>
              <TouchableHighlight onPress={() => goBack()} style={styles.backButton}>
                <Image
                  style={styles.backLeftArrowImg}
                  source={require('../../../assets/img/back-left-arrow.png')}
                  />
              </TouchableHighlight>
              <View>
                <Text style={{color: 'white', fontWeight: 'bold', fontSize: 22}}>{this.state.selectedProduct ? this.state.selectedProduct.name : ''}</Text>
              </View>
              <TouchableHighlight onPress={() => {this.showForm()}} style={styles.updateButton}>
                <Text style={{color: 'white', fontWeight: 'bold', fontSize: 22}}>更改</Text>
              </TouchableHighlight>
            </View>
          </View>

          <View style={{flex:1, flexDirection: 'row'}}>
            <View style={styles.flatListProduct}>
              {allProduct}
            </View>

            <View style={styles.flatListSubCategory}>
              {allSubCategory}
            </View>

            <View style={styles.flatListCategory}>
              {allCategory}
            </View>
          </View>
          {
            // this.checkShowView()
          }
            <PopupDialog ref={(productDialog) => { this.productDialog = productDialog; }}
                          dialogAnimation={slideAnimation}>


            { this.state.showPopupCategory &&
              <View style={{backgroundColor: 'white', height: height, width: width, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start'}}>
                <View>
                  <TextInput
                    style={{fontSize: 30}}
                    placeholder= "Nom categorie       "
                    defaultValue={this.state.selectedCategory.name}
                    onChangeText= {(categoryName) => this.updateCategory(categoryName)}
                  />
                </View>
              </View>
            }

            { this.state.showPopupSubCategory &&
              <View style={{backgroundColor: 'white', height: height, width: width, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start'}}>
                
                  <TextInput
                    style={{fontSize: 30}}
                    placeholder= "Nom sous categorie"
                    defaultValue={this.state.selectedSubCategory.name}
                    onChangeText= {(subCategoryName) => this.updateSubCategory(subCategoryName)}
                  />
                
              </View>
            }
          </PopupDialog>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({

    container: {
      flex: 1,
    },
    foodImg: {
      height: 20,
      width: 20,
    },

    //  navBar Header

    containerOrderBack: {
      
      backgroundColor: 'black'
    },

    navBarStyle: {
      height: height / 9,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
    },


    backButton: {
      justifyContent: 'flex-start',
    },

    backLeftArrowImg: {
      height: 60,
      width: 60,
      tintColor: 'white',
    },

    updateButton: {
      justifyContent: 'flex-end',
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

  
    // List tab {Produit}

    listProduct: {
      flex: 1,
      backgroundColor: 'red',
    },
    listSubCategory: {
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      height: 60,
      width: 60
    },
    listCategory: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'orange',
      height: 60,
      width: 60,
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

    productViewEmpty: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      alignItems: 'center',
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

    // Button SubMenu

    categoryButton: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      height: width / 12,
    },

    subMenu: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    selectedSubMenu: {
      width: width / 5,
    },

    subMenuText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center'
    },

    // style basket

    FlatListBasket: {
      backgroundColor: '#E2EAE3',
    },

    styleTextListOrder: {
      flex: 1,
      justifyContent: 'space-between',
      textAlign: "center",
      fontSize: 20,
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
      height: 30,
      width: 30,
    },

    textTitle: {
      flex: 1,
      flexDirection: 'column',
      textAlign: 'center',
      color: 'black',
      fontWeight: 'bold',
      fontSize: 20,
    },

  });
