import * as React from 'react';
import { View, StyleSheet, Dimensions,Text,Image} from 'react-native';
import { TabView, SceneMap ,TabBar} from 'react-native-tab-view';
import {Chat} from './app/chat'
import Status from './app/status'
import Calls from './app/calls'
const FirstRoute = () => (
  <Chat/>
);
 
const SecondRoute = () => (
  <Status/>
);
 
const ThirdRoute = () => (
  <Calls/>
);
 
const initialLayout = { width: Dimensions.get('window').width};
 
export default function TabViewExample() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Chat' },
    { key: 'second', title: 'Status' },
    { key:'third' ,title:'Calls'}
  ]);
 
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute
  });
 
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.HeaderText}>WhatsApp</Text>
        <Image style={styles.logo} source={require('./assest/search.png')}/>
        <Image style={[styles.logo,{marginLeft:'7%'}]} source={require('./assest/more.png')}/>
      </View>
    
      <TabView style={styles.tab}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(props) =>
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'snow' ,height:1,width:150 }}
            style={{backgroundColor: "#16a085", height: 50}}
          />}
      
      />
      </View>
  );
}
 
const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  container:
  {
    flex:1,
    justifyContent:'flex-start'
  },
  header:
  {
      flex:1,
      justifyContent:'flex-start',
      backgroundColor:'#16a085',
      flexDirection:'row'
  },
  HeaderText:
  {
      marginTop:6,
      marginStart:'5%',
      fontSize:25,
      fontWeight:'100',
      color:'white'
  },
  logo:
  {
    height:25,
    width:25,
    marginTop:10,
    marginLeft:'47%',
    alignItems:'center'
  },
  tab:
  {
    flex:13,
    backgroundColor:'white',
  },
});