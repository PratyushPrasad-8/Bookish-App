import { View, Text } from 'react-native'
import React from 'react'
import styles from '../../assets/styles/create.styles'
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';

export default function RenderRatingStars (rating){
    const stars=[]
    for(let i = 1; i <=5; i++) {
      stars.push(
        i <= rating ? (<Ionicons key = {i} name="star" size={15} color="orange"/>)
        :(<Ionicons key={i} name="star-outline" size={15} color={COLORS.textSecondary} style={{marginRight: 2}}/>)
      )
    }

    return (
      <View style={styles.ratingContainer}>
        {stars}
      </View>
    )
  };