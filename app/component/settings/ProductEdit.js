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
  FlatList,
  TouchableHighlight,
  Modal,
} from 'react-native';

import realm from '../../models/realm'
import { FormLabel, FormInput, CheckBox, Button } from 'react-native-elements'
let { height, width } = Dimensions.get('window');

export default class ProductEdit extends React.Component {
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
      // printKitchen: this.product.printKitchen,


      selectedCategory: realm.objects('Category').filtered('id = 1')[0],
      selectedSubCategory: realm.objects('SubCategory').filtered('id = 1')[0],
    }
  }

  componentWillUnmount() {
    realm.removeAllListeners();
  }

  saveProduct() {

    var priceTtc = !isNaN(this.state.productPrice) && this.state.productPrice.toString().match(/^-?\d*(\.\d+)?$/) ? parseFloat(this.state.productPrice) : 0;

    var product = {
      name: this.state.productName,
      code: this.state.productCode,
      priceTtc: priceTtc,
      categoryId: this.category.id,
      subCategoryId: this.subCategory.id,
      // printKitchen: this.state.printKitchen,
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
    this.product = product;
    const { navigate, goBack } = this.props.navigation;
    this.props.navigation.state.params.refresh();
    goBack();
    alert('成功');

  }

  deleteProduct() {
    var prod = realm.objects('Product').filtered('id = ' + this.product.id);
    realm.write(() => {
      realm.delete(prod);
    })
    const { navigate, goBack } = this.props.navigation;
    this.props.navigation.state.params.refresh();
    goBack();
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
            <TouchableOpacity onPress={() => { this.props.navigation.state.params.refresh(); goBack() }} style={styles.backButton}>
              <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
                <Image
                  style={styles.backLeftArrowImg}
                  source={require('../../../assets/img/back-left-arrow.png')}
                />
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>返回</Text>
              </View>

            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>{this.state.selectedProduct.name}</Text>
            </View>
            <TouchableOpacity onPress={() => this.deleteProduct()} style={styles.updateButton}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>删除</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flex: 10, backgroundColor: 'white', flexDirection: 'column', alignItems: 'flex-start' }}>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={{ flex: 10 }}>
            <FormLabel>菜名</FormLabel>
              <FormInput onChangeText={(val) => this.setState({ productName: val })} defaultValue={this.product.name} />
              <FormLabel>菜号</FormLabel>
              <FormInput onChangeText={(val) => this.setState({ productCode: val })} defaultValue={this.product.code} />
              <FormLabel>价钱</FormLabel>
              <FormInput keyboardType="numeric" onChangeText={(val) => this.setState({ productPrice: val })} placeholder={this.product.priceTtc.toFixed(2)} />

            </View>
            <View style={{ flex: 4 }}>
              {/* <CheckBox
                  center
                  title='重量'
                  checked={this.product.gram}
                  
                  onPress={()=> { 
                   // this.product.gram = !this.product.gram;
                    this.setState({productGram: !this.state.productGram});
                  }}
                /> */}
              {/* <CheckBox
                center
                title='打印厨房'
                checked={this.product.printKitchen}
                onPress={() => {

                  //   this.product.printKitchen = !this.product.printKitchen;
                  this.setState({ printKitchen: !this.state.printKitchen });
                }}
              /> */}

              <Button
                large={true}
                color='white'
                buttonStyle={{ flex: 1, width: width, backgroundColor: 'red' }}
                title='保存'
                onPress={() => this.saveProduct()}
              />
            </View>
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
  contentContainer: {
    padding: 0,
    flex: 1,
  },
  //  navBar Header

  containerOrderBack: {
    flex: 1,
    backgroundColor: 'red'
  },

  navBarStyle: {
    height: height / 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },


  backButton: {
    justifyContent: 'flex-start',
  },

  backLeftArrowImg: {
    height: 20,
    width: 20,
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