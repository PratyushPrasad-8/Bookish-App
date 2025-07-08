import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from '../../assets/styles/profile.styles'
import { Image } from 'expo-image';
import date from '../../components/Functions/date';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import COLORS from '../../constants/colors';

export default function ProfileHeader({user}) {
  const[uri, setUri]= useState(user.profileImage);
  const[isLoading, setIsLoading] = useState(false);

  const changeImage = () => {
    setIsLoading(true);
    let randomNum = Math.floor(Math.random() * 1000);
    let newUri=`https://api.dicebear.com/9.x/fun-emoji/svg?seed=${randomNum}`;
    setUri(newUri);
    setIsLoading(false);
  }

  return (
    <View style={styles.profileHeader}>
      <TouchableOpacity style={styles.profileImageContainer} onPress={changeImage}>
        {isLoading ?
        (<ActivityIndicator size="small" color={COLORS.primary} />) : 
        (<Image source={{uri: uri}} style={styles.profileImage} />)}
        <Text style={styles.memberSince}>  Tap to Change</Text> 
        <Text style={styles.memberSince}>   (Temporarily)</Text>
      </TouchableOpacity>
      

      <View style={styles.profileInfo}>
        <Text style={styles.username}>    {user.username}</Text>
        <Text style={styles.email}>     {user.email}</Text>
        <Text style={styles.memberSince}>      Member since,  {date(user.createdAt)}</Text>
      </View>
    </View>
  )
}