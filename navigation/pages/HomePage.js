import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, DeviceEventEmitter, Vibration, RefreshControl} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
  const Item = ({ title, content, date }) => {
    return (
      <View style={styles.item}>
        <Text numberOfLines={1} style={styles.title}>{title}</Text>
        <Text style={styles.date}>{date}</Text>
        <Text numberOfLines={1} style={styles.contents}>{content}</Text>
      </View>
    );
  }

export default function HomePage(){
    // 控制刷新获取的bool值
    const [flag, setFlag] = useState();
    // 键元素列表
    const [keysElm, setKeysElm] = useState([]);
    // 是否刷新获取
    const [refreshing, setRefreshing] = React.useState(false);
    // 总日记数
    const [count,setCount] = useState(0)

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      setFlag(true)
      wait(2000).then(() => setRefreshing(false));
    }, []);

    if(flag == undefined){
      setFlag(true)
    }

    function setKeys(value){
      setKeysElm(value)
    }
    

    const renderItem = ({ item }) => (
        <Item title={item.title} content={item.content} date={item.date} />
      );
    
      return (
        
        <SafeAreaView style={styles.container}>
          <Text style={{marginHorizontal:20,marginTop:-15,color:'#666666'}}>Total: {count} notes. 上拉刷新</Text>
          <ImportData _SetKeys={setKeys} flag={flag} _SetFlag={setFlag} _SetCount={setCount} />
          <FlatList
            data={keysElm}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </SafeAreaView>
      );
}

const ImportData = ({_SetKeys,flag,_SetFlag,_SetCount})=>{
  const [localFlag, setFlag] = useState(false);
  var dataBack = {}
  var trueData = []
  console.log("window flag from home page: " + flag)
  var count = 0;
  // var token = await AsyncStorage.getAllKeys();
  // var someItems = token.filter(tokenID => tokenID.length==4);
  AsyncStorage.getAllKeys()
    .then((keys)=> AsyncStorage.multiGet(keys)
      .then((data) => {
        for(var i = 0; i < data.length; i++){
          if(data[i][0].length == 4){
            const jsonValue = JSON.parse(data[i][1]);
            // console.log(data[i][0])
            dataBack = {'id':data[i][0],'title':jsonValue.title, 'content':jsonValue.content, 'date':jsonValue.date}
            trueData[count] = dataBack
            count++
          }
        }
        _SetCount(count)
        count = 0
        // 有数据传来，需要更新
        if(flag){
          setFlag(false)
          console.log(localFlag)
          _SetFlag(false)
        }

        if(trueData!=null && !localFlag){
          _SetKeys(trueData)
          setFlag(true)
        }
      }));

        return(
          <View></View>
        );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF2F6',
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    maxHeight:160,
    overflow:'hidden',
    
  },
  title: {
    fontSize: 30
  },
  date: {
    color: '#9B9B9B',
    marginLeft: 5
  },
  contents:{
    fontSize: 20,
    margin: 5
  },
});