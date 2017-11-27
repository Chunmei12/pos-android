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
  Linking,
} from 'react-native';

let {height, width} = Dimensions.get('window');

export default class ContactScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={{flex: 1, backgroundColor: 'lightblue', alignItems: 'center', flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => navigate('Menu')}>
            <Image
              style={{flexWrap: 'wrap', height: 40, width: 40}}
              source={require('../../assets/img/back-left-arrow.png')}
            />
          </TouchableOpacity>
          <Text style={styles.textTitle}> Contact </Text>
        </View>
        <View style={{flex: 8, backgroundColor: '#47ACA6', flexDirection: 'column'}}>
          <View style={{flexDirection: 'column', height: height / 8, width: width, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity style={{flexDirection: 'row', height: height / 8, width: width, alignItems: 'center', justifyContent: 'flex-start'}} onPress={() => Linking.openURL('mailto:contact@easoft.pro?subject=&body=')}>
              <Image
                style={{flexWrap: 'wrap', height: 70, width: 70}}
                source={require('../../assets/img/email.png')}
              />
              <Text style={{flexWrap: 'wrap', fontSize: 20, color: 'white'}}>contact@easoft.pro</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'column', height: height / 8, width: width, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
            <Text style={{flexWrap: 'wrap', textAlign: 'justify', fontSize: 20, color: 'white', fontWeight: 'bold', marginLeft: 10}}>Siège social:{'\n'}</Text>
            <Text style={{flexWrap: 'wrap', textAlign: 'justify', fontSize: 15, color: 'white', fontWeight: 'bold', marginLeft: 10}}>{'\t'}39 Rue Marceau{'\n'}{'\t'}94200 Ivry Sur Seine{'\n'}{'\t'}tel: 01 78 54 15 93 {'\n'}{'\t'}</Text>
            <Text style={{flexWrap: 'wrap', textAlign: 'justify', fontSize: 20, color: 'white', fontWeight: 'bold', marginLeft: 10}}>Point de vente / démo:{'\n'}</Text>
            <Text style={{flexWrap: 'wrap', textAlign: 'justify', fontSize: 15, color: 'white', fontWeight: 'bold', marginLeft: 10}}>{'\t'}19 Rue Henri Gautier{'\n'}{'\t'}93000 Bobigny{'\n'}{'\t'}07 82 88 56 07</Text>
          </View>
          <View style={{flexDirection: 'column', height: height / 0.88, width: width, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{flexWrap: 'wrap', textAlign: 'justify', fontSize: 12, color: 'white', marginLeft: 10}}>EA Soft © 2017</Text>
            <Text style={{flexWrap: 'wrap', textAlign: 'justify', fontSize: 12, color: 'white', marginLeft: 10}}>Logiciel d{'\''}encaissement pour la restauration certifié NF525</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection: 'column'
  },

  textTitle: {
    flex: 1,
    flexDirection: 'column',
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },

})
