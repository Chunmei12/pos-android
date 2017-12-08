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

import realm from '../../models/realm'
import CheckBox from 'react-native-check-box'

let {height, width} = Dimensions.get('window');

export default class ProductEdit  extends React.Component {
  constructor(props) {
      super(props);
      this.product = this.props.navigation.state.params.product
      this.category = this.props.navigation.state.params.category
      this.subCategory = this.props.navigation.state.params.subCategory
      this.saveProduct = this.saveProduct.bind(this)
    
      realm.addListener('change', () => {
        this.product = {}
      });

      this.state = {
        selectedProduct: this.product,
        productName: this.product.name,
        productCode: this.product.code,
        productPrice: 0,
        productGram: this.product.gram,
        printKitchen: this.product.printKitchen,


        selectedCategory: realm.objects('Category').filtered('id = 1')[0],
        selectedSubCategory: realm.objects('SubCategory').filtered('id = 1')[0],
      }
    }

    componentWillUnmount() {
      realm.removeAllListeners();    
    }

    saveProduct () {

      var priceTtc = !isNaN(this.state.productPrice) && this.state.productPrice.toString().match(/^-?\d*(\.\d+)?$/) ? parseFloat(this.state.productPrice) : 0;
      
      var product = {
        name: this.state.productName,
        code: this.state.productCode,
        priceTtc: priceTtc,
        categoryId: this.category.id,
        subCategoryId: this.subCategory.id,
        printKitchen: this.state.printKitchen,
        gram: this.state.productGram,
        position: this.product.position,
        color: '#000000',
        type: 'product'
      };
  
      if (this.product.id != 0) {
        product.id = this.product.id
      }
      else {
        product.id = realm.objects('Product').length > 0 ? realm.objects('Product').sorted('id')[realm.objects('Product').length - 1].id + 1 : 1;
      }

      realm.write(() => {
        realm.create('Product', product, true)
      })
      this.product = product
      alert('成功')

    }

    deleteProduct() {
        let products = realm.objects('Product').sorted('id');
        realm.write(() => {
          realm.delete(products.filtered('id = ' + this.product.id));
        })
        // const { navigate, goBack } = this.props.navigation;
        // goBack()
    }


    render() {
      const { navigate, goBack } = this.props.navigation;
    
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
                <Text style={{color: 'white', fontWeight: 'bold', fontSize: 22}}>{this.state.selectedProduct.name}</Text>
              </View>
              <TouchableOpacity onPress={() => this.saveProduct()} style={styles.updateButton}>
                <Text style={{color: 'white', fontWeight: 'bold', fontSize: 22}}>保存</Text>
              </TouchableOpacity>
            </View>
          </View>

            <View style={{backgroundColor: 'white', width: width, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start'}}>
            
              <ScrollView>
                <TextInput
                  style={{fontSize: 30, width: width}}
                  placeholder= "菜名"
                  defaultValue={this.product.name}
                  onChangeText={(val) => this.setState({productName: val})}
                  />
              
                  
                <TextInput
                  style={{fontSize: 30, width: width}}
                  placeholder= "菜号"
                  defaultValue={this.product.code}
                  onChangeText={(val) => this.setState({productCode: val})}
                  />
              
      
              
                <TextInput
                  style={{fontSize: 30, width: width}}
                  placeholder="价钱"
                  defaultValue={this.product.priceTtc.toFixed(2)}
                  onChangeText={(val) => this.setState({productPrice: val})}
                  />
              
                <CheckBox
                  style={{flex: 1, height: 30}}
                  onClick={()=> this.setState({productGram: !this.state.productGram})}
                  isChecked={this.product.gram}
                  leftText={'重量'}
                  leftTextStyle={{fontSize: 26}}
                />

                <CheckBox
                  style={{flex: 1, height: 30}}
                  onClick={()=> this.setState({printKitchen: !this.state.printKitchen})}
                  isChecked={this.product.printKitchen}
                  leftText={'打印厨房'}
                  leftTextStyle={{fontSize: 26}}
                />

                <TouchableOpacity onPress={() => this.deleteProduct()}>
                  <Text>
                    删除
                  </Text>
                </TouchableOpacity>

              </ScrollView>
          </View>
          
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

    updateButton: {
      justifyContent: 'flex-end',
    },

  });