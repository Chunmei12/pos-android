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
  TouchableOpacity,
  Dimensions,
} from 'react-native';

//import Login from 'react-native-simple-login'
import realm from '../models/realm'

let {height, width} = Dimensions.get('window');

const Realm = require('realm');

export default class LoginScreen extends React.Component {
  constructor(){
    super();
    state = {
      modalVisible: false,
    }

    this.state = {isLoggedIn : false, email :"", password : ""};
  }

  _showModal = () => this.setState({ ModalVisible: true })

  _hideModal = () => this.setState({ ModalVisible: false })

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
          {/* <Image
            style={styles.imgBackground}
            source={require('../../assets/img/backGround.jpg')}>
            <Text style={styles.introduction}>EA Soft</Text>
              <View style={{marginRight: 30, marginLeft: 30, marginBottom: 15}}>
                <View style={styles.containerEmail}>
                  <TextInput style={styles.emailInput}
                    placeholder = "Email"
                    returnKeyType = "next"
                    underlineColorAndroid='transparent'
                    onChangeText= {(text) => this.setState({email : text})}
                  />
                </View>

                <View style={styles.containerPW}>
                  <TextInput style={styles.emailInput}
                    secureTextEntry
                    returnKeyType= 'go'
                    onChangeText= {(password) => this.setState({password : password})}
                    placeholder = "Mot de passe"
                    />
              </View>
              </View> */}
                <View style={styles.containerButtonLogin}>
                  <Button
                    onPress={() => navigate('Menu')}
                    title="Connexion"
                    color="#841584"
                  />
              </View>
              
          {/* </Image> */}
      </View>
    );
  }
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection: 'column',
  },

  introduction: {
    fontSize: 45,
    color: "white",
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 100,
  },

  containerEmail: {
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
    backgroundColor: 'white',
  },

  containerPW: {
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
  },

  imgBackground: {
    height: height,
    width: width,
  },

  emailInput: {
    color: '#1C1F1F',
    fontSize: 25,
    height: height / 12,
    width: width / 1,
  },

  containerButtonLogin: {
    width: width / 1.2,
    marginLeft: 30,
  },

  styleContactAdmin: {
    color: 'white',
    fontSize: 40,
    width: width / 10,
    height: height / 5,
  },

  containerButtonContactAdmin: {
    marginTop: width / 1.7,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  backLeftArrowImgLoginStyle: {
    height: 20,
    width: 20,
    tintColor: 'black',
  },

});
