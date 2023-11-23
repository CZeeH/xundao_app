import React, { useState, useEffect } from 'react';
import {
  Platform, SafeAreaView, ScrollView, StyleSheet, Text, View, Dimensions, TouchableOpacity, Alert
} from 'react-native';
import { router, useGlobalSearchParams } from 'expo-router';
import { ip } from '../../common';
import { xundao_list } from '../../static'

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
      ]
    )
  }

  const changeProbability = (key) => {
    Alert.alert(
      '概率调整中',
      '请等待10秒后再回到游戏！',
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
    // setTimeout(() => {
    //   setBackgroundColors(prevState => ({
    //     ...prevState,
    //     [key]: prevState[key] === '#fdf1e8' ? 'transparent' : '#fdf1e8'
    //   }));
    // }, 10000)
  }

  return (
    <SafeAreaView>
      <ScrollView>

        <View style={[style.view1]}>
          <Text style={[style.textTitle]}>
            到期时间: {new Date(endTime).toLocaleString()}
          </Text>
          {/* <Text style={[style.textTitle]}>
          {endTime}
          </Text> */}
          <View style={[style.btnView]}>
            <TouchableOpacity style={style.button} onPress={outLoad}>
              <Text style={style.text}>退出登陆</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[style.view2]}>
          <Text style={[style.textTitle2]}>
            砍伐专用概率修改 up++
          </Text>
        </View>
        <View style={[style.list]}>
          {
            xundao_list.map((value, index) => (
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
      </ScrollView>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
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
