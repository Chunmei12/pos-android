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
} from 'react-native';

let {height, width} = Dimensions.get('window');
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
export default class MenuScreen extends React.Component {
  constructor(props) {
    super(props);
  }

    _handleButton() {
      Alert.alert('En cours de developpement')
    }

  render () {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <View style={{flex: 8, backgroundColor: 'white', flexDirection: 'column'}}>
        <ActionButton buttonColor="rgba(231,76,60,1)" offsetY = {300} onPress={()=>navigate('OrderList') }icon={<Icon name = "md-cart" style={{color:'white',fontSize:15}} >点餐</Icon>}>
         
        </ActionButton >
        <ActionButton  offsetY = {200} buttonColor="#9b59b6" onPress={()=>navigate('OrderList')} icon={<Icon name = "md-paper"  style={{color:'white',fontSize:15}} >订单</Icon>}>
         
        </ActionButton>
        <ActionButton  offsetY = {100} buttonColor="#3498db"  icon={<Icon name = "md-hammer" style={{color:'white',fontSize:15}} >设置</Icon>}>
            <ActionButton.Item buttonColor='orange' title="菜单" onPress={() => navigate('Product')}>
              <Icon name="md-barcode" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          <ActionButton.Item buttonColor='#9b59b6' title="打印机" onPress={() => navigate('Printer')}>
              <Icon name="md-print" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#3498db' title="店消息" onPress={() => {navigate('TicketHeader')}}>
              <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#1abc9c' title="小票" onPress={() => {navigate('TicketFooter')}}>
              <Icon name="md-color-palette" style={styles.actionButtonIcon} />
            </ActionButton.Item>
        </ActionButton>
          {/* <TouchableOpacity style={{flexDirection: 'column', height: height / 4, width: width, alignItems: 'center', justifyContent: 'center', borderRadius: 5}} onPress={() => navigate('OrderList')}>
            <Text style={{flexWrap: 'wrap', textAlign: 'justify', fontSize: 28}}>点单</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{flexDirection: 'column', height: height / 4, width: width, alignItems: 'center', justifyContent: 'center', borderRadius: 5}} onPress={() => navigate('Product')}>
            <Text style={{flexWrap: 'wrap', textAlign: 'justify', fontSize: 28}}>菜单</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{flexDirection: 'column', height: height / 4, width: width, alignItems: 'center', justifyContent: 'center', borderRadius: 5}} onPress={() => navigate('Printer')}>
            <Text style={{flexWrap: 'wrap', textAlign: 'justify', fontSize: 28}}>打印机</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{flexDirection: 'column', height: height / 4, width: width, alignItems: 'center', justifyContent: 'center', borderRadius: 5}} onPress={() => navigate('TicketHeader')}>
            <Text style={{flexWrap: 'wrap', textAlign: 'justify', fontSize: 28}}>店消息</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{flexDirection: 'column', height: height / 5, width: width, alignItems: 'center', justifyContent: 'center', borderRadius: 5}} onPress={() => navigate('TicketFooter')}>
            <Text style={{flexWrap: 'wrap', textAlign: 'justify', fontSize: 28}}>票消息</Text>
          </TouchableOpacity> */}

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection: 'column',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
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
