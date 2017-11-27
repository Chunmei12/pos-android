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
  Button,
} from 'react-native';

let {height, width} = Dimensions.get('window');
import realm from '../../models/realm'

export default class TicketFooter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      footers: realm.objects('TicketFooter')
    }
    this.updateUI = this.updateUI.bind(this)
    this.addNewLine = this.addNewLine.bind(this)
    this.updateLine = this.updateLine.bind(this)
    this.deleteLine = this.deleteLine.bind(this)

    realm.addListener('change', this.updateUI);
  }

  componentWillUnmount() {
    realm.removeAllListeners();    
  }

  updateUI() {
    this.setState({
      footers: realm.objects('TicketFooter'),
    })
  }

  addNewLine () {
    let lastId = realm.objects('TicketFooter').length ? realm.objects('TicketFooter').sorted('id', true)[0].id : 0;
    realm.write(() => {
      realm.create('TicketFooter', {
        id: lastId + 1,
        text: '',
      }, true)
    })
  }

  updateLine(item, text) {
    realm.write(() => {
      realm.create('TicketFooter', {
        id: item.id,
        text: text,
      }, true)
    })
  }

  deleteLine(item) {

    let FooterLine = realm.objects('TicketFooter').filtered('id = ' + item.id)[0];
    
    realm.write(() => {
      realm.delete(FooterLine); 
    })
  }

  _renderItem = ({item}) => (
      <View style={{flexDirection: 'row'}}>
        <TextInput style={{flex: 1, height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 10}}
          placeHolder={item.index}
          defaultValue={item.text}
          onChangeText={(text) => this.updateLine(item, text)}
        />
        
        <Button
          onPress={() => this.deleteLine(item)}
          title="X"
          color="black"
          accessibilityLabel="Delete"
        />
      </View>
  )

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
          
            <TouchableOpacity style={styles.addButton} onPress={() => this.addNewLine()}>
              <Text style={styles.addText}>+</Text>
            </TouchableOpacity>

            <FlatList
              data={this.state.footers}
              extraData={this.state}
              renderItem={this._renderItem}
              keyExtractor={(item, index) => index}
            />

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

  addButton: {
    alignItems: 'center'
  },

  addText: {
    fontSize: 38
  }

})
