import React, { useState, useEffect } from 'react';
import {
  Platform, SafeAreaView, ScrollView, StyleSheet, Text, View, Dimensions, TouchableOpacity, Alert
} from 'react-native';
import { router, useGlobalSearchParams } from 'expo-router';
import { ip, xundao_list } from '../../static';

const Index = () => {
  const [backgroundColors, setBackgroundColors] = useState({});
  const [timeoutId, setTimeoutId] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const glob = useGlobalSearchParams();
  useEffect(() => {
    getRestTime()
    return () => {
      clearTimeout(timeoutId); // 清除计时器
    }
  }, []);

  const getRestTime = async () => {
    const params = {
      password: glob.pwd,
      type: 'use'
    };

    const url = `${ip}?` + Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');

    await fetch(url)
      .then(response => response.text())
      .then(result => {
        const { msg, code, endTime } = JSON.parse(result) || {}
        console.log(code, msg, endTime)
        if (code === 'success') {
          setEndTime(endTime)
          const targetTime = new Date(endTime)
          const currentTime = new Date(); // 获取当前时间
          const timeDifference = targetTime - currentTime;
          console.log(typeof timeDifference, timeDifference)
          if (timeDifference > 0) {
            const timeout = setTimeout(() => {
              Alert.alert(
                '卡密时间到期',
                '请联系客服续费',
                [
                  {
                    text: '确定',
                    onPress: () => router.replace('/'),
                    style: 'destructive'
                  },
                ]
              )
            }, timeDifference);
            setTimeoutId(timeout);
            return
          }
        }
        Alert.alert(
          '卡密时间到期',
          '请联系客服续费',
          [
            {
              text: '确定',
              onPress: () => router.replace('/'),
              style: 'destructive'
            },
          ]
        )
      })
      .catch(error => {
        Alert.alert(
          '网络异常',
          `${error}`,
          [
            {
              text: '确定',
              onPress: () => router.replace('/'),
              style: 'destructive'
            },
          ]
        )
      })
  }

  const outLoad = () => {
    Alert.alert(
      '退出登陆',
      '是否退出登陆',
      [
        {
          text: '确定',
          onPress: () => router.replace('/'),
          style: 'destructive'
        },
        {
          text: '取消',
          style: 'cancle',
        },
      ]
    )
  }

  const changeProbability = (key) => {
    Alert.alert(
      '概率调整成功',
      '请等待10秒后再回到游戏即可生效。',
      [
        {
          text: '确定',
          onPress: () => console.log('确定'),
          style: 'destructive'
        },
      ]
    )
    setBackgroundColors(prevState => ({
      ...prevState,
      [key]: prevState[key] === '#fdf1e8' ? 'transparent' : '#fdf1e8'
    }));
  }

  return (
    <SafeAreaView  style={[style.wrapper]}>
      <ScrollView>

        <View style={[style.view1]}>
          <Text style={[style.textTitle]}>
            到期时间: {new Date(endTime).toLocaleString()}
          </Text>
          <View style={[style.btnView]}>
            <TouchableOpacity style={style.button} onPress={outLoad}>
              <Text style={style.text}>退出登陆</Text>
            </TouchableOpacity>
          </View>
        </View>
          <ScrollView style={[style.view3]}>
            <View style={[style.textReadBtn]}>
              <Text style={[style.textReadTitle]}>使用帮助</Text>
              <Text style={[style.textRead]}>1.关闭其它在用软件，检查网络，打开游戏，进入到游戏中</Text>
              <Text style={[style.textRead]}>2.回到桌面打开本软件，输入卡密登录</Text>
              <Text style={[style.textRead]}>3.选择对应的功能模块，勾选需要增加的功能。</Text>
              <Text style={[style.textRead]}>4.点击启动助手，提示上游戏，则切换回游戏界面即可</Text>
              <Text style={[style.textRead]}>
                5"宝箱提升专用功能"可以多选。宝箱等级未达到对应的装备基础概率为0的话提升是无效的，如神铸装备获得的基础概率为0，那么就算勾选了
                “神铸装备获得概率功能”也是无法进行提升的，在选择功能时请务必确认该级别的装备基础概率，不选则开箱提升无效</Text>
            </View>
          </ScrollView>
        {
          xundao_list.map((obj, indexobj) => (
            <View>
              <View style={[style.view2]} >
                <Text style={[style.textTitle2]}>
                  {obj.listName}
                </Text>
              </View>
              <View style={[style.list]}>
                {obj.list.map((value, index) => (

                  <TouchableOpacity
                    onPress={() => changeProbability(value)}
                    key={value + index}
                  >
                    <Text
                      style={[
                        style.item,
                        {
                          backgroundColor: backgroundColors[value] || 'transparent',
                          color: backgroundColors[value] === '#fdf1e8' ? '#dc682a' : 'black'
                        }
                      ]}
                    >
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))
                }
              </View>
            </View>

          ))
        }
      </ScrollView>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  wrapper:{
  },
  view1: {
    width: Dimensions.get('window').width * 0.9,
    borderColor: '#ccc',
    borderWidth: 1,
    height: 100,
    margin: 10,
    borderRadius: 5,
    padding: 1,
    elevation: 1.5,
    // ios 专用阴影
    shadowColor: '#ddd',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  view3: {
    width: Dimensions.get('window').width * 0.9,
    borderColor: '#ccc',
    borderWidth: 1,
    height: 150,
    margin: 10,
    borderRadius: 5,
    padding: 2,
    elevation: 1.5,
    // ios 专用阴影
    shadowColor: '#ddd',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 1.5,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  textReadBtn: {
    marginLeft: 10,
    width: Dimensions.get('window').width * 0.8,
  },
  textReadTitle:{
    textAlign:'center',
    fontSize:16,
    color: '#3e73b9',
    marginBottom:7,
    marginTop:3
  },
  textRead: {
    color: '#3e73b9'
  },
  textTitle: {
    width: '100%',
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 5
  },
  btnView: {
    width: '60%',
    marginTop: 10
  },
  button: {
    backgroundColor: '#eef4fe',
    padding: 10,
    borderRadius: 5,
  },
  view2: {
    margin: 5,
    borderColor: '#f2f2f4',
    borderWidth: 1,
    borderRadius: 5,
    padding: 3,
    // elevation: 1,
  },
  text: {
    color: '#3e73b9', // 设置文字颜色为白色
    textAlign: 'center',
    fontSize: 15
  },
  textTitle2: {
    width: '100%',
    fontSize: 20,
    color: '#f1aa46',
    fontWeight: 'bold',
  },
  item: {
    textAlign: 'center',
    width: Dimensions.get('window').width * 0.5 - 8,
    height: 58,
    padding: 2,
    margin: 4,
    borderWidth: 1,
    borderColor: '#c2c8cc',
    borderRadius: 12,
    fontSize: 18,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
});



export default Index;
