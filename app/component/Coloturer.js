import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Image,
  // Button,
  ScrollView,
  FlatList,
  List,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Keyboard
} from 'react-native';

import realm from '../models/realm'
import Moment from 'react-moment';
let { height, width } = Dimensions.get('window');
let moment = require('moment');
import { Order } from '../classObject';
import { printTicket } from '../printData'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import Grid from 'react-native-grid-component';
import { Card, ListItem, Button, FormLabel, FormInput } from 'react-native-elements'
const slideAnimation = new SlideAnimation({
  slideFrom: 'bottom',
});

export default class Coloturer extends React.Component {
  constructor(props) {
    super(props);
    this._onPressButton = this._onPressButton.bind(this)
    this.updateUI = this.updateUI.bind(this)
    this.orders = realm.objects('Order').sorted('id')

    this.state = {
      allOrders: realm.objects('Order').filtered('closed = true').sorted('createdAt'),
      tables: Array.prototype.slice.call(realm.objects('Table').filtered('name != "" AND type != "object"').sorted('name')).sort((a, b) => a.name.localeCompare(b.name)),
      totalTakeAway: realm.objects('Order').filtered('type = "takeAway" AND closed = false').length,
      totalBar: realm.objects('Order').filtered('type = "bar" AND closed = false').length,
      totalDelivery: realm.objects('Order').filtered('type = "delivery" AND closed = false').length,
      config: realm.objects('Config')[0],
      orderSit: realm.objects('Order').filtered('type = "sit" AND closed = true').sorted('createdAt', true),
      ordertakeAway: realm.objects('Order').filtered('type = "takeAway" AND closed = true').sorted('createdAt', true),
      sitNumber: '',
      nbCustomer: '',
    }
    realm.addListener('change', this.updateUI);

  }

  componentWillUnmount() {
    realm.removeAllListeners();
  }

  updateUI() {
    this.setState({
      orderSit: realm.objects('Order').filtered('type = "sit" AND closed = true').sorted('createdAt', true),
      ordertakeAway: realm.objects('Order').filtered('type = "takeAway" AND closed = true').sorted('createdAt', true),
    })
  }

  _renderItem = (item, i) => {
    let hour = moment(item.createdAt).format("kk");
    let min = moment(item.createdAt).format("mm");
    return (
      <View style={styles.item} key={item.id}>
        <TouchableOpacity style={{ flexDirection: 'row', flex: 1 }} onPress={() => this._onPressButton(item.id)}>
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

  _onPressButton(order) {
    const { navigate } = this.props.navigation
    navigate('OrderDetail', {
      orderId: order.id,
      refresh: () => {
        this.forceUpdate();
      }
    })
  }


  newOrder(orderType) {

    const { navigate } = this.props.navigation

    if (orderType == 'bar') {
      var newOrder = new Order(this.orders.length > 0 ? this.orders[this.orders.length - 1].id + 1 : 1, 'bar');
      newOrder.table = 'C' + (this.state.totalBar + 1)
      newOrder.nbPrinted = 1
      newOrder.userId = 1//this.props.currentUser.id
      newOrder.userName = 'Gerant'//this.props.currentUser.name
      // newOrder.deviceId = this.state.config.deviceId
      // newOrder.appVersion = this.state.config.appVersion
      // newOrder.ticketHeaderId = this.state.config.ticketHeaderId
      // newOrder.ticketFooterId = this.state.config.ticketFooterId
      newOrder.deviceId = 1
      newOrder.appVersion = '1'
      newOrder.ticketHeaderId = 1
      newOrder.ticketFooterId = 1
      realm.write(() => {
        realm.create('Order', newOrder)
      })
      navigate('Order', { orderId: newOrder.id })
    }
    else if (orderType == 'takeAway') {
      var newOrder = new Order(this.orders.length > 0 ? this.orders[this.orders.length - 1].id + 1 : 1, 'takeAway');
      newOrder.table = 'E' + (this.state.totalTakeAway + 1)
      newOrder.nbPrinted = 1
      newOrder.userId = 1//this.props.currentUser.id
      newOrder.userName = 'Gerant'//this.props.currentUser.name
      // newOrder.deviceId = this.state.config.deviceId
      // newOrder.appVersion = this.state.config.appVersion
      // newOrder.ticketHeaderId = this.state.config.ticketHeaderId
      // newOrder.ticketFooterId = this.state.config.ticketFooterId
      newOrder.deviceId = 1
      newOrder.appVersion = '1'
      newOrder.ticketHeaderId = 1
      newOrder.ticketFooterId = 1
      realm.write(() => {
        realm.create('Order', newOrder)
      })
      navigate('Order', { orderId: newOrder.id })
    }
    else if (orderType == 'sit') {
      //this.setState({sitNumber: '', nbCustomer: ''})
      this.keyboardDialog.show()
      //  this.refs.sitNumber.focus()
    }
  }

  finishOrder() {
      const {goBack} = this.props.navigation
      let orders = realm.objects('Order').filtered('closed = true');
    realm.write(() => {
      realm.delete(orders);
    })
    goBack();
  }
  newSitOrder(table) {
    const { navigate } = this.props.navigation
    var newOrder = new Order(this.orders.length > 0 ? this.orders[this.orders.length - 1].id + 1 : 1, 'sit');
    newOrder.table = table.name
    newOrder.nbPrinted = 1
    newOrder.userId = 1//this.props.currentUser.id
    newOrder.userName = 'Gerant'//this.props.currentUser.name
    newOrder.deviceId = this.state.config.deviceId
    newOrder.appVersion = this.state.config.appVersion
    newOrder.ticketHeaderId = this.state.config.ticketHeaderId
    newOrder.ticketFooterId = this.state.config.ticketFooterId
    realm.write(() => {
      realm.create('Order', newOrder)
      realm.create('Table', { id: table.id, idOrder: newOrder.id }, true);
    })

    navigate('orderView', { orderId: newOrder.id })
    this.tableListDialog.dismiss()
  }

  newSitOrderStep2() {
    this.keyboardDialog.dismiss();
    Keyboard.dismiss();
    var reg = new RegExp('^[0-9]+$');
    if (!reg.test(this.state.sitNumber)) { alert('桌号'); return }
    if (!reg.test(this.state.nbCustomer)) { alert('人数'); return }
    const { navigate } = this.props.navigation
    var idOrder = realm.objects('Order').length > 0 ? realm.objects('Order').sorted('id')[realm.objects('Order').length - 1].id + 1 : 1;
    var newOrder = new Order(idOrder, 'sit');
    newOrder.table = this.state.sitNumber
    newOrder.nbCustomer = parseInt(this.state.nbCustomer)
    newOrder.userId = 1//this.props.currentUser.id
    newOrder.userName = 'Gerant'//this.props.currentUser.name
    newOrder.deviceId = 1
    newOrder.totalTtc = 0.00
    newOrder.appVersion = '1'
    newOrder.ticketHeaderId = 1
    newOrder.ticketFooterId = 1
    realm.write(() => {
      realm.create('Order', newOrder, true)
    })

    navigate('Order', { orderId: newOrder.id })
    this.setState({ sitNumber: '', nbCustomer: '' })
  }
  _renderItemOrder = ({ item, index }) => {
    <View style={{ height: '100%', width: '100%', flexDirection: "row", alignItems: 'flex-start', backgroundColor: 'white' }}>
      <Text style={{ flex: 1, color: 'black', fontSize: 18 }}>{index}</Text>
      <Text style={{ flex: 1, color: 'red', fontSize: 18 }}>{item.priceTtc.toFixed(2)}€</Text>
      <Text style={{ color: 'black', fontSize: 18 }}>{item.quantity}</Text>
    </View>
  }
  _renderItemDetail = ({ item, index }) => {
    return (
      <View style={styles.containerBasket}>
        <View style={{ flexDirection: "row", flex: 1, borderWidth: 0, backgroundColor: 'white', padding: 5 }}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: 'center' }}>
            {/* todo:// 菜品*/}
            <Text style={{ flex: 1, color: 'black', fontSize: 18 }}>{item.name}</Text>
            <Text style={{ color: 'black', fontSize: 18 }}>{item.quantity}</Text>
          </View>

        </View>
      </View>
    )
  }

  _renderItemLeft = ({ item }) => (
    <Card
      key={item.id}
      title={'订单号：' + item.id}
    >
      <TouchableOpacity onPress={() => {
       // this._onPressButton(item);
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: 'black', fontSize: 18 }}>桌号：{item.table}</Text>
          <Text style={{ color: 'black', fontSize: 18 }}>人数：{item.nbCustomer}</Text>
          <Text style={{ color: 'black', fontSize: 18 }}>时间：{ moment(item.createdAt).format('DD-MM-YYYY HH:mm')}</Text>
          <Text style={{ color: 'black', fontSize: 18 }}>金额：{item.totalTtc.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    </Card>
  );
  _renderItemRight = ({ item }) => (
    <Card
      key={item.id}
      title={'打包: ' + item.table}
    >
      <TouchableOpacity onPress={() => {
        this._onPressButton(item);
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: 'black', fontSize: 18 }}>订单号：{item.id}</Text>
          <Text style={{ color: 'black', fontSize: 18 }}>金额：{item.totalTtc.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    </Card>
  );
  render() {
    const { navigate,goBack } = this.props.navigation;
    let allOrders=[];
    let allTotalTtc = 0;
    if(this.state.allOrders.length>0){
        var createdAtStart = moment(this.state.allOrders[0].createdAt).format('DD-MM-YYYY HH:mm');
        var createdAtEnd = moment(this.state.allOrders[this.state.allOrders.length-1].createdAt).format('DD-MM-YYYY HH:mm');
    }
    for(var i =0; i< this.state.orderSit.length; i++){
      var order = this.state.orderSit[i]; 
      allTotalTtc += order.totalTtc;
      // var titleText = '桌号: ' + order.table;
      if(order.id % 2 == 0){
        
        allOrders.push(order);

      }else{
        allOrders.push(order);
      }

    }

    for(var i =0; i< this.state.ordertakeAway.length; i++){
      var order = this.state.ordertakeAway[i]; 
      allTotalTtc += order.totalTtc;
      
     // var titleText = '桌号: ' + order.table;
      if(order.id % 2 == 0){
        allOrders.push(order);

      }else{
        allOrders.push(order);
      }

    }

    return (
      <View style={styles.container}>
        <View style={styles.containerOrderBack}>
             <View style={styles.navBarStyle}>
               <TouchableOpacity onPress={() => {goBack();}} style={styles.backButton}>
                 
               <View style={{flexDirection:"row", flex:1, alignItems:"center"}}>
                 <Image
                   style={styles.backLeftArrowImg}
                   source={require('../../assets/img/back-left-arrow.png')}
                   />
                 <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>返回</Text>
               </View>
               </TouchableOpacity>
               <View style={{ flex:1, alignItems:"center"}}>
                 <Text style={{color: 'white',fontWeight: 'bold', fontSize: 18}}></Text>
               </View>
               <TouchableOpacity onPress={() => { this.finishOrder();}} style={styles.updateButton}>
                 <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>结算</Text>
               </TouchableOpacity>
             </View>
           </View>
        <View style={{ flex: 1,width:width }}>
          <ScrollView contentContainerStyle={styles.tabLabelStyle2} scrollEnabled={true}>
            <View style={{ flex: 1,alignItems: 'flex-start', backgroundColor: '#e6ffe6' }}>
            <Text style={{ color: 'black', fontSize: 18 }}>订单数量：{allOrders.length}</Text>
            <Text style={{ color: 'black', fontSize: 18 }}>开始时间：{createdAtStart}</Text>
            <Text style={{ color: 'black', fontSize: 18 }}>结束时间：{createdAtEnd}</Text>
            <Text style={{ color: 'black', fontSize: 22, color: 'red' }}>金额：{allTotalTtc}€</Text>
          </View>
          <View style={{ flex: 4 ,width:width }}>
              <FlatList
              
                data={allOrders}
                extraData={this.state}
                keyExtractor={(item) => item.id}
                renderItem={this._renderItemLeft}
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
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    width:width
  },
  FlatListBasket: {
    height: '100%',
    backgroundColor: 'gray',
  },
  containerNumberFalse: {
    height: width / 7,
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  FlatListBasket: {
    height: '100%',
    backgroundColor: 'blue',
  },

  containerItemA: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },

  item: {
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: "white"
  },
  item: {
    flex: 1,
    height: 160,
    margin: 1
  },
  list: {
    flex: 1
  },
  productContainer: {
    flex: 20,
    marginTop: -20,
  },
  tabLabelStyle2: {
    flex: 1,
    flexDirection: 'column',
  },
  itemPrice: {
    flex: 1,
    justifyContent: 'space-between',
    textAlign: "right",
    fontSize: 22,
    fontWeight: 'bold',
    color: "black"
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
    color: 'black',
    textAlign: 'center',
  },

  containerback: {
    backgroundColor: 'white',
    flex: 1,
  },

  FlatListHome: {
    backgroundColor: 'white',
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
    width: width / 10,
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

  containerOrderBack: {
    width:width,
    padding: 0,
    backgroundColor: 'red'
  },
  navBarStyle: {
    height: height / 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },


  backButton: {
    alignItems:"flex-start",
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
