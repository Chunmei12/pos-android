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
import realm from '../../models/realm'

export default class PrinterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textFirstPrinter: realm.objects('Printer')[0] ? realm.objects('Printer')[0].ipAddress : '',
      textSecondPrinter: realm.objects('Printer')[1] ? realm.objects('Printer')[1].ipAddress : '',
      textThirdPrinter: realm.objects('Printer')[2] ? realm.objects('Printer')[2].ipAddress : '',
    }


  }

  _saveValuePrinter (numberPrinter, printerIp) {
    realm.write(() => {
      realm.create('Printer', {
        id: numberPrinter,
        name: '',
        ipAddress: printerIp
      }, true)
    })
  }

  render () {
    const { navigate, goBack } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={{flex: 1, backgroundColor: 'white', alignItems: 'center', flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => goBack()}>
            <Image
              style={{flexWrap: 'wrap', height: 40, width: 40}}
              source={require('../../../assets/img/back-left-arrow.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={{flex: 14, backgroundColor: 'white', flexDirection: 'column', padding: 20}}>
          
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
            <Text style={styles.printerName}>打印机 n°1</Text>
            <TextInput
              style={styles.printerIp}
              placeholder="ip 地址: 192.168.1.1"
              defaultValue={this.state.textFirstPrinter}
              onChangeText={(ip) => this._saveValuePrinter(1, ip)}
            />
          </View>


            
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
              <Text style={styles.printerName}>打印机 n°2</Text>
              <TextInput
                style={styles.printerIp}
                placeholder="ip 地址: 192.168.1.1"
                defaultValue={this.state.textSecondPrinter}
                onChangeText={(ip) => this._saveValuePrinter(2, ip)}
              />
          </View>

          
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
            <Text style={styles.printerName}>打印机 n°3</Text>
              <TextInput
                style={styles.printerIp}
                placeholder="ip 地址: 192.168.1.1"
                defaultValue={this.state.textThirdPrinter}
                onChangeText={(ip) => this._saveValuePrinter(3, ip)}
              />
          </View>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection: 'row',
  },

  textTitle: {
    flex: 1,
    flexDirection: 'column',
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },

  printerName: {
    fontSize: 30, 
    fontStyle: 'italic'
  },

  printerIp: {
    textAlign: 'right', 
    width: width / 1.2, 
    fontSize: 28
  }

})
