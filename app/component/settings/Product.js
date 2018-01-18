import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Button,
  FlatList,
  TouchableHighlight,
  Modal,
} from 'react-native';
import { List, ListItem, FormLabel, FormInput, FormValidationMessage } from "react-native-elements";
import DatePicker from 'react-native-datepicker';
import { TabNavigator } from "react-navigation";
import ScrollableTabView, { DefaultTabBar, } from 'react-native-scrollable-tab-view';
import moment from 'moment';
import realm from '../../models/realm'
import PopupDialog, { SlideAnimation, DialogTitle, DialogButton } from 'react-native-popup-dialog';

let { height, width } = Dimensions.get('window');
const slideAnimation = new SlideAnimation({
  slideFrom: 'bottom',
});

export default class Product extends React.Component {
  constructor(props) {
    super(props);

    this.updateUI = this.updateUI.bind(this)
    this.selectCategory = this.selectCategory.bind(this)
    this.selectSubCategory = this.selectSubCategory.bind(this)
    this.selectProduct = this.selectProduct.bind(this)
    this.updateCategory = this.updateCategory.bind(this)
    this.updateSubCategory = this.updateSubCategory.bind(this)
    this.showForm = this.showForm.bind(this)

    this.subCategory = [{ position: 1, id: 0 },
    { position: 2, id: 0 },
    { position: 3, id: 0 },
    { position: 4, id: 0 },
    { position: 5, id: 0 },
    { position: 6, id: 0 },
    { position: 7, id: 0 },
    { position: 8, id: 0 }]

    this.product = [{ id: 0, name: '', code: '', position: 1, priceTtc: 0, gram: false, printKitchen: true }
    ]


    this.state = {
      dbCategory: realm.objects('Category').filtered('id > 0'),
      dbSubCategory: realm.objects('SubCategory'),
      dbProduct: realm.objects('Product'),
      settings: false,
      selectedProduct: { priceTtc: 0 },
      selectedCategory: realm.objects('Category').filtered('id > 0').length == 0 ? { id: 0 } : realm.objects('Category').filtered('id > 0').sorted('id')[0],
      selectedSubCategory: realm.objects('SubCategory').filtered('id = 1')[0],
    }
    realm.addListener('change', this.updateUI);

  }

  componentWillUnmount() {
    realm.removeAllListeners();
  }

  updateUI() {
    this.setState({
      selectedProduct: { priceTtc: 0 },
      dbCategory: realm.objects('Category').filtered('id > 0'),
      dbSubCategory: realm.objects('SubCategory'),
      dbProduct: realm.objects('Product'),
    })

  }

  selectCategory(category) {

    this.setState({
      subCategoryPosition: 1,
      selectedCategory: category,
      selectedSubCategory: { id: 0 },
      showPopupProduct: false,
      showPopupSubCategory: false,
      showPopupCategory: true
    })
    this.forceUpdate();
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
    var idCategory = 0;
    if (this.state.selectedCategory.id != 0) {
      idCategory = this.state.selectedCategory.id
    }
    else {
      idCategory = realm.objects('Category').length > 0 ? realm.objects('Category').sorted('id')[realm.objects('Category').length - 1].id + 1 : 1;
      this.setState({ selectedCategory: { id: idCategory, name: newName } });
    }
    realm.write(() => {
      realm.create('Category', {
        id: idCategory,
        name: newName,
      }, true)
    })
    this.forceUpdate();
  }

  updateSubCategory(newName) {
    realm.write(() => {
      realm.create('SubCategory', {
        id: this.state.selectedSubCategory.id,
        name: newName,
      }, true)
    })
  }
  deleteCategory() {
    if (this.state.selectedCategory.id != 0) {
      var cateco = realm.objects('Category').filtered('id = ' + this.state.selectedCategory.id);
      var prods = realm.objects('Product').filtered('categoryId = ' + this.state.selectedCategory.id);
      this.setState({ selectedCategory: { id: 0, name: null } })
      realm.write(() => {
        realm.delete(prods);
        realm.delete(cateco);
      });

      this.productDialog.dismiss();
      this.forceUpdate();
      alert('删除成功');
    }
  }
  showForm() {
    this.productDialog.show()
  }
  showFormProduct(prod) {
    const { navigate } = this.props.navigation;
    navigate('ProductEdit', {
      product: prod,
      category: this.state.selectedCategory,
      subCategory: this.state.selectedSubCategory,
      refresh: () => {
        this.forceUpdate();
      }
    })


  }
  render() {

    const { navigate, goBack } = this.props.navigation;
    return (
      <View style={styles.container}>

        <View style={styles.containerOrderBack}>
          <View style={styles.navBarStyle}>
            <TouchableOpacity onPress={() => { goBack(); }} style={styles.backButton}>

              <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
                <Image
                  style={styles.backLeftArrowImg}
                  source={require('../../../assets/img/back-left-arrow.png')}
                />
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>返回</Text>
              </View>
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>菜谱</Text>
            </View>
            <TouchableOpacity onPress={() => { this.forceUpdate(); }} style={styles.updateButton}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>刷新</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flex: 1, flexDirection: 'row', padding: 0 }}>

          <View style={styles.flatListCategory}>

            <ScrollView contentContainerStyle={styles.contentContainer} scrollEnabled={true} >
              <List>
                <FlatList
                  data={realm.objects('Category').filtered('id > 0')}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[styles.menu, item.id == this.state.selectedCategory.id && { backgroundColor: '#F5FFFA' }]}
                      onPress={() => this.selectCategory(item)}
                      onLongPress={() => { this.selectCategory(item); this.showForm() }}>
                      <Text style={[styles.categoryName, { color: "black" },
                      this.state.selectedCategory.id == item.id && { color: 'red', fontSize: 22 }]}> {item.name}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => item.id}
                  ListFooterComponent={
                    <TouchableOpacity
                      style={[styles.product_empty]}
                      onPress={() => { this.selectCategory({ id: 0, name: null }); this.showForm() }}
                    >
                      <View style={[styles.productViewEmpty, { backgroundColor: 'orange' }]}>
                        <Text numberOfLines={3} style={styles.productName}>+</Text>
                      </View>
                    </TouchableOpacity>
                  }

                />
              </List>
            </ScrollView>
          </View>



          <View style={styles.flatListProduct}>
            <ScrollView contentContainerStyle={styles.productContainer} scrollEnabled={true}>
              <List>
                <FlatList
                  data={realm.objects('Product').filtered('categoryId = "' + this.state.selectedCategory.id + '"').sorted('name', false)}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => { this.showFormProduct(item); }}>
                      <ListItem
                        titleStyle={{ color: 'red', fontSize: 18 }}
                        title={item.name}
                        subtitle={item.priceTtc.toFixed(2) + "€"}
                        chevronColor="red"
                        style={{ frontSize: 20, }}
                      // hideChevron = {true}
                      />
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => item.id}
                  ListFooterComponent={
                    <TouchableOpacity
                      style={[styles.product_empty]}
                      onPress={() => this.showFormProduct(this.product[0])}>
                      <View style={[styles.productViewEmpty, { backgroundColor: 'orange' }]}>
                        <Text numberOfLines={3} style={styles.productName}>+</Text>
                      </View>
                    </TouchableOpacity>
                  }
                />
              </List>
            </ScrollView>

          </View>

        </View>

        <PopupDialog dismissOnTouchOutside={false}
          dialogStyle={{ padding: 10 }}
          dialogTitle={<DialogTitle title="Nom categoris" />}
          ref={(productDialog) => { this.productDialog = productDialog; }}
          actions={[
            <View key={0} style={{ flexDirection: 'row', flex: 1 }}>
              <DialogButton
                onPress={() => this.deleteCategory()}
                buttonStyle={{ borderRadius: 10, backgroundColor: "white", width: "50%", opacity: 1, borderColor: 'gray', borderWidth: 1 }} text="删除" />

              <DialogButton
                onPress={() => {
                  this.productDialog.dismiss();
                  this.forceUpdate();
                }}
                buttonStyle={{ borderRadius: 10, backgroundColor: "white", width: "50%", opacity: 1, borderColor: 'gray', borderWidth: 1 }} text="确认" />
            </View>
          ]}
          dialogAnimation={slideAnimation}>
          <View style={styles.dialogContentView}>
            <FormInput
              onChangeText={(categoryName) => this.updateCategory(categoryName)}
              defaultValue={this.state.selectedCategory.name}
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
  // foodImg: {
  //   height: 20,
  //   width: 20,
  // },

  //  navBar Header
  contentContainer: {
    padding: 0,
    flex: 1,
    marginTop: -20,
  },
  productContainer: {
    paddingBottom: 0,
    flex: 1,
    marginTop: -20,
  },
  containerOrderBack: {
    padding: 0,
    backgroundColor: 'red'
  },
  dialogContentView: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  navBarStyle: {
    height: height / 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
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


  flatListCategory: {
    flex: 1,
    backgroundColor: 'white',

  },


  // List tab {Produit}

  listProduct: {
    flex: 1,
    backgroundColor: 'red',
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
    width: width / 4,
    height: height / 9,
    justifyContent: 'center',
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
    width: width / 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "white"
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
