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
import {  FormLabel, FormInput } from "react-native-elements";

export default class TicketHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      footers: realm.objects('TicketHeader').sorted('id')
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
      footers: realm.objects('TicketHeader').sorted('id'),
    })
  }

  addNewLine () {
    let lastId = realm.objects('TicketHeader').length ? realm.objects('TicketHeader').sorted('id', true)[0].id : 0;
    realm.write(() => {
      realm.create('TicketHeader', {
        id: lastId + 1,
        text: '',
      }, true)
    })
  }

  updateLine(item, text) {
    realm.write(() => {
      realm.create('TicketHeader', {
        id: item.id,
        text: text,
      }, true)
    })
  }

  deleteLine(item) {

    let FooterLine = realm.objects('TicketHeader').filtered('id = ' + item.id)[0];
    
    realm.write(() => {
      realm.delete(FooterLine); 
    })
  }

  _renderItem = ({item}) => (
      <View style={{flexDirection: 'row'}}>
        <Button
          style ={{flex:1, padding:5}}
          onPress={() => this.deleteLine(item)}
          title="删除"
          color="red"
          accessibilityLabel="Delete"
        />
         <FormInput
               containerStyle ={{flex:1}}
               defaultValue={item.text}
               onChangeText={(text) => this.updateLine(item, text)}
            />
   
      </View>
  )

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
             <Text style={{color: 'white',fontWeight: 'bold', fontSize: 18}}>小票顶部</Text>
           </View>
           <TouchableOpacity onPress={() => { this.addNewLine();}} style={styles.updateButton}>
             <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>添加</Text>
           </TouchableOpacity>
         </View>
       </View>
        <View style={{flex: 14, backgroundColor: 'white', flexDirection: 'column', padding: 20}}>
          
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
