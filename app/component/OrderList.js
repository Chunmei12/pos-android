import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Image,
  Button,
  ScrollView,
  FlatList,
  List,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import realm from '../models/realm'
import Moment from 'react-moment';
let {height, width} = Dimensions.get('window');
let moment = require('moment');
import {Order} from '../classObject';
import {printTicket} from '../printData'
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
//import I18n from 'react-native-i18n'
require('../translations');

const slideAnimation = new SlideAnimation({
  slideFrom: 'bottom',
});

export default class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this._onPressButton = this._onPressButton.bind(this)
    this.updateUI = this.updateUI.bind(this)
    this.newSitOrderStep11 = this.newSitOrderStep11.bind(this)
    this.newSitOrderStep22 = this.newSitOrderStep22.bind(this)
    this.newSitOrderStep1 = this.newSitOrderStep1.bind(this)
    this.newSitOrderStep2 = this.newSitOrderStep2.bind(this)
    this.getStats = this.getStats.bind(this)
    //this.updateTablePrice = this.updateTablePrice.bind(this)
    
    this.orders = realm.objects('Order').sorted('id')
    this.state = {
      tables: Array.prototype.slice.call(realm.objects('Table').filtered('name != "" AND type != "object"').sorted('name')).sort((a, b) => a.name.localeCompare(b.name)),
      totalTakeAway: realm.objects('Order').filtered('type = "takeAway" AND closed = false').length,
      totalBar: realm.objects('Order').filtered('type = "bar" AND closed = false').length,
      totalDelivery: realm.objects('Order').filtered('type = "delivery" AND closed = false').length,
      config: realm.objects('Config')[0],
      orderSit: realm.objects('Order').filtered('type = "sit" AND closed = false').sorted('createdAt', true),
      ordertakeAway: realm.objects('Order').filtered('type = "takeAway" AND closed = false').sorted('createdAt', true),
      orderBar: realm.objects('Order').filtered('type = "bar" AND closed = false').sorted('createdAt', true),
      orderDelivery: realm.objects('Order').filtered('type = "delivery" AND closed = false').sorted('createdAt', true),
      sitNumber: '',
      nbCustomer: '',
      selectedTable: {id: 0, name: ''}
    }
    
    realm.addListener('change', this.updateUI);

  }

  componentWillUnmount() {
    realm.removeAllListeners();    
  }

  componentWillMount() {
    let finishedOrders = realm.objects('FinishedOrder').sorted('id', false).filtered('closed = false')
    this.getStats(finishedOrders);
  }

  updateUI() {
    this.setState({
      orderSit: realm.objects('Order').filtered('type = "sit" AND closed = false').sorted('createdAt', true),
      ordertakeAway: realm.objects('Order').filtered('type = "takeAway" AND closed = false').sorted('createdAt', true),
      orderBar: realm.objects('Order').filtered('type = "bar" AND closed = false').sorted('createdAt', true),
      totalTakeAway: realm.objects('Order').filtered('type = "takeAway" AND closed = false').length,
      totalBar: realm.objects('Order').filtered('type = "bar" AND closed = false').length,
    })
  }

  _renderItem = ({item}) => {
    let hour = moment(item.createdAt).format("kk");
    let min = moment(item.createdAt).format("mm");
    return (
      <View style={styles.flexListNow}>
        <TouchableOpacity style={{flexDirection: 'row', flex: 1}} onPress={() => this._onPressButton(item.id)}>
          <View style={styles.containerNumberFalse}>
            <Text style={styles.itemNumberNow}>{item.table} / cv: {item.nbCustomer}</Text>
          </View>
          <View style={styles.containerItemA}>
          {<Text style={styles.itemPrice}>{hour}H{min}</Text>}
          {<Text style={styles.itemPrice}>{item.totalTtc.toFixed(2)} €</Text>}
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  _onPressButton(id) {
    const { navigate } = this.props.navigation
    navigate('Order', {orderId: id})
  } 

  newOrder(orderType) {

    const { navigate } = this.props.navigation

    if (orderType == 'bar') {
      var newOrder = new Order(this.orders.length > 0? this.orders[this.orders.length - 1].id + 1 : 1,'bar');
      newOrder.table = 'C' + (this.state.totalBar + 1)
      newOrder.nbPrinted = 0
      newOrder.userId = 1//this.props.currentUser.id
      newOrder.userName = 'Gerant'//this.props.currentUser.name
      // newOrder.deviceId = this.state.config.deviceId
      // newOrder.appVersion = this.state.config.appVersion
      // newOrder.ticketHeaderId = this.state.config.ticketHeaderId
      // newOrder.ticketFooterId = this.state.config.ticketFooterId
      newOrder.deviceId = 2
      newOrder.appVersion = '1.9'
      newOrder.ticketHeaderId = 1
      newOrder.ticketFooterId = 1
      realm.write(() => {
        realm.create('Order', newOrder )
      })
      navigate('Order', {orderId: newOrder.id})
    }
    else if (orderType == 'takeAway') {
      var newOrder = new Order(this.orders.length > 0? this.orders[this.orders.length - 1].id + 1 : 1,'takeAway');
      newOrder.table = 'E' + (this.state.totalTakeAway + 1)
      newOrder.nbPrinted = 0
      newOrder.userId = 1//this.props.currentUser.id
      newOrder.userName = 'Gerant'//this.props.currentUser.name
      // newOrder.deviceId = this.state.config.deviceId
      // newOrder.appVersion = this.state.config.appVersion
      // newOrder.ticketHeaderId = this.state.config.ticketHeaderId
      // newOrder.ticketFooterId = this.state.config.ticketFooterId
      newOrder.deviceId = 2
      newOrder.appVersion = '1.8'
      newOrder.ticketHeaderId = 1
      newOrder.ticketFooterId = 1
      realm.write(() => {
        realm.create('Order', newOrder )
      })
      navigate('Order', {orderId: newOrder.id})
    }
    else if (orderType == 'sit') {
      this.setState({sitNumber: '', nbCustomer: ''})
      this.tableListDialog.show()
    }
    else if (orderType == 'sit') {
      this.setState({sitNumber: '', nbCustomer: ''})
      this.keyboardDialog.show()
      this.refs.sitNumber.focus()
    }
  }

  newSitOrderStep11(table) {
    this.setState({selectedTable: table})
    this.tableListDialog.dismiss()
    this.personKeyboardDialog.show()
    this.refs.nbCustomer.focus()
  }

  newSitOrderStep22() {
    
    var newOrder = new Order(this.orders.length > 0? this.orders[this.orders.length - 1].id + 1 : 1, 'sit');
    newOrder.table = this.state.selectedTable.name
    newOrder.nbPrinted = 0
    newOrder.userId = 1//this.props.currentUser.id
    newOrder.userName = 'Gerant'//this.props.currentUser.name
    newOrder.deviceId = 2
    newOrder.appVersion = '1.8'
    newOrder.ticketHeaderId = 1
    newOrder.ticketFooterId = 1
    realm.write(() => {
      realm.create('Order', newOrder )
      realm.create('Table', { id: this.state.selectedTable.id, idOrder: newOrder.id }, true);
    })

    const { navigate } = this.props.navigation 
    navigate('order', {orderId: newOrder.id})
    this.personKeyboardDialog.dismiss()
    this.setState({sitNumber: '', nbCustomer: ''})
  }

  newSitOrderStep1() {
    if (this.state.sitNumber == '') return
    this.keyboardDialog.dismiss()
    this.personKeyboardDialog.show()
    this.refs.nbCustomer.focus()
  }

  newSitOrderStep2() {
    if (this.state.nbCustomer == '') return
    
    var newOrder = new Order(this.orders.length > 0? this.orders[this.orders.length - 1].id + 1 : 1, 'sit');
    newOrder.table = this.state.sitNumber
    newOrder.nbCustomer = parseInt(this.state.nbCustomer)
    newOrder.userId = 1//this.props.currentUser.id
    newOrder.userName = 'Gerant'//this.props.currentUser.name
    newOrder.deviceId = 2
    newOrder.appVersion = '1.8'
    newOrder.ticketHeaderId = 1
    newOrder.ticketFooterId = 1
    realm.write(() => {
      realm.create('Order', newOrder )
    })

    const { navigate } = this.props.navigation
    navigate('Order', {orderId: newOrder.id})
    this.personKeyboardDialog.dismiss()
    this.setState({sitNumber: '', nbCustomer: ''})
  }


  getStats(finishedOrders) {
    var totalTtc = 0;
    var totalHt = 0; 
    var totalHt1 = 0; 
    var totalHt2 = 0; 
    var totalHt3 = 0;
    var totalTtc1 = 0;
    var totalTtc2 = 0;
    var totalTtc3 = 0;
    var ESP = 0, CB = 0, TR = 0, CQ = 0, CV = 0, Amex = 0, Credit = 0;

    for (var i = 0; i < finishedOrders.length; i++) {
      var order = finishedOrders[i];
      if (order.canceled) continue;
      totalTtc += order.totalTtc;
      totalHt += order.totalHt;
      totalHt1 += order.totalHt1;
      totalHt2 += order.totalHt2;
      totalHt3 += order.totalHt3;
      totalTtc1 += order.totalTtc1;
      totalTtc2 += order.totalTtc2;
      totalTtc3 += order.totalTtc3;
    }
    
    this.setState({
      totalTtc: totalTtc,
      totalHt: totalHt,
      totalVat1: totalTtc1 - totalHt1,
      totalVat2: totalTtc2 - totalHt2,
      totalVat3: totalTtc3 - totalHt3,
    })
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <ScrollableTabView
          style={{ backgroundColor: "black"}}
          tabBarUnderlineStyle={{ backgroundColor: 'white'}}
          tabBarActiveTextColor={'white'}
          tabBarInactiveTextColor={'grey'}
          tabBarTextStyle={{fontSize: 28}}
          renderTabBar={() => <DefaultTabBar style={{height: 100}}/>} >

        <View tabLabel={'Sur place'} style={styles.tabLabelStyle} >
          <TouchableOpacity 
            onPress={() => this.newOrder("sit")}
            style={{ height: 80, marginTop: 10}}>
            <Text style={{color: 'white', fontSize: 60, textAlign: 'center'}}>+</Text>
          </TouchableOpacity>
          <FlatList
            style={styles.FlatListHome}
            data={this.state.orderSit}
            renderItem={this._renderItem}
            keyExtractor={item => item.id}
          />
        </View>



        {/* <View tabLabel={'Bar'} style={styles.tabLabelStyle}>
          <TouchableOpacity 
            onPress={() => this.newOrder("bar")}
            style={{ height: 80, marginTop: 10}}>
            <Text style={{color: 'white', fontSize: 60, textAlign: 'center'}}>+</Text>
          </TouchableOpacity>
          <FlatList
            style={styles.FlatListHome}
            data={this.state.orderBar}
            renderItem={this._renderItem}
            keyExtractor={item => item.id}
          />
        </View> */}

        <View tabLabel={'Emportée'} style={styles.tabLabelStyle}>
          <TouchableOpacity 
            onPress={() => this.newOrder("takeAway")}
            style={{ height: 80, marginTop: 10}}>
            <Text style={{color: 'white', fontSize: 60, textAlign: 'center'}}>+</Text>
          </TouchableOpacity>
          <FlatList
            style={styles.FlatListHome}
            data={this.state.ordertakeAway}
            renderItem={this._renderItem}
            keyExtractor={item => item.id}
          />
        </View>

        {/* <View tabLabel={I18n.t('LIVRAISON')} style={styles.tabLabelStyle}>
          <TouchableOpacity 
            onPress={() => this.newOrder("delivery")}
            style={{ height: 80, marginTop: 10}}>
            <Text style={{color: 'white', fontSize: 60, textAlign: 'center'}}>+</Text>
          </TouchableOpacity>
          <FlatList
            style={styles.FlatListHome}
            data={this.state.orderDelivery}
            renderItem={this._renderItem}
            keyExtractor={item => item.id}
          />
        </View> */}

          {/* <View tabLabel={'Stats'} style={styles.tabLabelStyle}>

            <View style={{flexDirection: 'row'}}>
              <Text style={styles.itemPrice}>Total TTC</Text>
              <Text style={styles.itemPrice}>{this.state.totalTtc.toFixed(2)} €</Text>
            </View>

            <View style={{flexDirection: 'row'}}>
              <Text style={styles.itemPrice}>Total HT</Text>
              <Text style={styles.itemPrice}>{this.state.totalHt.toFixed(2)} €</Text>
            </View>


            <View style={{flexDirection: 'row'}}>
              <Text style={styles.itemPrice}>Tva 5.50%</Text>
              <Text style={styles.itemPrice}>{this.state.totalVat1.toFixed(2)} €</Text>
            </View>

            <View style={{flexDirection: 'row'}}>
              <Text style={styles.itemPrice}>Tva 10%</Text>
              <Text style={styles.itemPrice}>{this.state.totalVat2.toFixed(2)} €</Text>
            </View>

            <View style={{flexDirection: 'row'}}>
              <Text style={styles.itemPrice}>Tva 20%</Text>
              <Text style={styles.itemPrice}>{this.state.totalVat3.toFixed(2)} €</Text>
            </View>


          </View> */}

        </ScrollableTabView>

        <PopupDialog ref={(tableListDialog) => { this.tableListDialog = tableListDialog; }}
                      dialogAnimation={slideAnimation}>
                      
          <View style={{backgroundColor: 'white', height: height, width: width}}>
            <ScrollView
                pagingEnabled={true}
                horizontal={false}
                showsHorizontalScrollIndicator={false}
                bounces={false}
                onScroll={this.handleTableScroll}
                scrollEventThrottle={16}
                >
                <View style={styles.scrollView}>
                  {
                    this.state.tables.map((table, idx) => (
                      
                      <TouchableOpacity key={idx} 
                                        style={[styles.square, table.idOrder != 0 && {backgroundColor: 'red'}]}
                                        onPress={() => this.newSitOrderStep11(table)}
                                        disabled={table.idOrder != 0 ? true : false}>
                        <Text style={styles.tableNumber}>{table.name}</Text>
                      </TouchableOpacity>

                    ))
                  }
                </View>
              </ScrollView>
            </View>
        </PopupDialog>


        <PopupDialog ref={(keyboardDialog) => { this.keyboardDialog = keyboardDialog; }}
                      dialogAnimation={slideAnimation}
                      onDismissed={() => this.refs.sitNumber.blur()} >
          
                <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                  <TextInput
                    ref='sitNumber'
                    style={{fontSize: 70, textAlign: 'center', flexDirection: 'row', flex: 1}}
                    placeholder={'Table'}
                    keyboardType="numeric"
                    defaultValue={this.state.sitNumber}
                    onChangeText={(text) => this.setState({sitNumber: text})}  
                  />

                  <TouchableOpacity onPress={() => this.newSitOrderStep1()} style={{flex: 1, alignItems: 'center'}}>
                      <Text style={styles.buttonOk}>OK</Text>
                  </TouchableOpacity>
                </View>
                  
                    
                    {/* <TouchableOpacity>
                      <Text style={styles.letter}>A</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Text style={styles.letter}>B</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Text style={styles.letter}>C</Text>
                    </TouchableOpacity> */}

        </PopupDialog>


        <PopupDialog ref={(personKeyboardDialog) => { this.personKeyboardDialog = personKeyboardDialog; }}
                      dialogAnimation={slideAnimation}
                      onDismissed={() => this.refs.nbCustomer.blur()} >
          
                <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                  <TextInput
                    ref='nbCustomer'
                    style={{fontSize: 70, textAlign: 'center', flexDirection: 'row', flex: 1}}
                    placeholder={'Personnes'}
                    keyboardType="numeric"
                    defaultValue={this.state.nbCustomer}
                    onChangeText={(text) => this.setState({nbCustomer: text})}
                    
                  />
                  <TouchableOpacity onPress={() => this.newSitOrderStep22()} style={{flex: 1, alignItems: 'center'}}>
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  containerNumberFalse: {
    height: width / 7,
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },

  containerItemA: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },

  item: {
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: "white"
  },

  itemPrice: {
    flex: 1,
    justifyContent: 'space-between',
    textAlign: "right",
    fontSize: 22,
    fontWeight: 'bold',
    color: "white"
  },

  printerButton: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },

  printerImg: {
    height: 40,
    width: 40,
    tintColor: 'white'
  },

  itemStyleFinish: {
    flex: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexListFinished: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    width: width
  },
  flexListNow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    width: width,
  },
  itemNumberNow: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },

  containerback: {
    backgroundColor: 'black',
    flex: 1,
  },

  FlatListHome: {
    backgroundColor: 'black',
    flexDirection: 'column',
    flexWrap: 'wrap',
    flex: 1,
  },

  // Button "Sur Place" "Emportée"

  containerButtonHome: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    height: height / 160,
  },

  containerButtonHomePlace: {
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    height: height / 10,
  },

  containerButtonHomeEmportee: {
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    height: height / 10,
    width : width / 10,
    alignItems: 'stretch',
  },

  buttonHomePlace: {
    flex: 1,
    backgroundColor: '#2B98F0',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 5,
  },

  buttonHomeEmportee: {
    flex: 1,
    backgroundColor: '#2B98F0',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 5,
  },

  textButtonHomePlace: {
    flex: 1,
    color: 'white',
    flexDirection: 'row',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },

  textButtonHomeEmportee: {
      flex: 1,
      color: 'white',
      flexDirection: 'row',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 20,
  },

  // Other


  tabLabelStyle: {
    flex: 1,
    flexDirection: 'column',
  },

  tableList: {
    flex: 1,
    flexDirection: 'row',
  },

  scrollView: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  square: {
    width: (width / 3) - 12, 
    height: 100, 
    borderWidth: 2, 
    borderColor: 'black', 
    margin: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  tableNumber: {
    fontSize: 33,
    color: 'black',
    textAlign: 'center'
  },

  letter: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center'
  },

  buttonOk: {
    fontSize: 60,
    marginTop: 20,
    textAlign: "center",
  }

});
