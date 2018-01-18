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
import { FormLabel, FormInput,CheckBox} from 'react-native-elements'
export default class PrinterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textFirstPrinter: realm.objects('Printer')[0] ? realm.objects('Printer').sorted('id')[0].ipAddress : '',
      textSecondPrinter: realm.objects('Printer')[1] ? realm.objects('Printer').sorted('id')[1].ipAddress : '',
      textThirdPrinter: realm.objects('Printer')[2] ? realm.objects('Printer').sorted('id')[2].ipAddress : '',
      printKitchen:false
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
      <View style={styles.containerOrderBack}>
      <View style={styles.navBarStyle}>
        <TouchableOpacity onPress={() => {goBack();}} style={styles.backButton}>
          
        <View style={{flexDirection:"row", flex:1, alignItems:"center"}}>
          <Image
            style={styles.backLeftArrowImg}
            source={require('../../../assets/img/back-left-arrow.png')}
            />
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>返回</Text>
        </View>
        </TouchableOpacity>
        <View style={{ flex:1, alignItems:"center"}}>
          <Text style={{color: 'white',fontWeight: 'bold', fontSize: 18}}>打印机</Text>
        </View>
        <TouchableOpacity onPress={() => { this.forceUpdate();}} style={styles.updateButton}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>刷新</Text>
        </TouchableOpacity>
      </View>
    </View>

        <View style={{flex: 14, backgroundColor: 'white', flexDirection: 'column'}}>
          
          <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'flex-start'}}>
            <FormLabel>打印机 n°1</FormLabel>
            <FormInput 
                 style={styles.printerIp}
                 placeholder="ip 地址: 192.168.1.1"
                 defaultValue={this.state.textFirstPrinter}
                 onChangeText={(ip) => this._saveValuePrinter(1, ip)}
            />
          </View>


          <CheckBox
                title='厨房'
                iconRight
                iconType='material'
                checkedIcon='clear'
                uncheckedIcon='add'
                checkedColor='red'
                checked={this.state.printKitchen}
                onIconPress={() => {
                  this.setState({ printKitchen: !this.state.printKitchen });
                }}
              /> 
              {
                this.state.printKitchen  && 
                <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'flex-start'}}>
                <FormLabel>厨房 n°2</FormLabel>
                  <FormInput 
                     style={styles.printerIp}
                     placeholder="ip 地址: 192.168.1.1"
                     defaultValue={this.state.textSecondPrinter}
                     onChangeText={(ip) => this._saveValuePrinter(2, ip)}
                  />
                  
                </View>
              }
       

{/*           
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
          <FormLabel>打印机 n°3</FormLabel>
            <FormInput 
                  style={styles.printerIp}
                  placeholder="ip 地址: 192.168.1.1"
                  defaultValue={this.state.textThirdPrinter}
                  onChangeText={(ip) => this._saveValuePrinter(3, ip)}
            />
          </View> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
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
  },
  containerOrderBack: {
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

})
