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

          <TouchableOpacity style={{flexDirection: 'column', height: height / 5, width: width, alignItems: 'center', justifyContent: 'center', borderRadius: 5}} onPress={() => navigate('OrderList')}>
            <Text style={{flexWrap: 'wrap', textAlign: 'justify', fontSize: 28}}>点单</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{flexDirection: 'column', height: height / 5, width: width, alignItems: 'center', justifyContent: 'center', borderRadius: 5}} onPress={() => navigate('Product')}>
            <Text style={{flexWrap: 'wrap', textAlign: 'justify', fontSize: 28}}>菜单</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{flexDirection: 'column', height: height / 5, width: width, alignItems: 'center', justifyContent: 'center', borderRadius: 5}} onPress={() => navigate('Printer')}>
            <Text style={{flexWrap: 'wrap', textAlign: 'justify', fontSize: 28}}>打印机</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{flexDirection: 'column', height: height / 5, width: width, alignItems: 'center', justifyContent: 'center', borderRadius: 5}} onPress={() => navigate('TicketHeader')}>
            <Text style={{flexWrap: 'wrap', textAlign: 'justify', fontSize: 28}}>店消息</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{flexDirection: 'column', height: height / 5, width: width, alignItems: 'center', justifyContent: 'center', borderRadius: 5}} onPress={() => navigate('TicketFooter')}>
            <Text style={{flexWrap: 'wrap', textAlign: 'justify', fontSize: 28}}>票消息</Text>
          </TouchableOpacity>

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

  textTitle: {
    flex: 1,
    flexDirection: 'column',
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },

});
