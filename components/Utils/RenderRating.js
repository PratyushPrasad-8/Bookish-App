import { View, Text, TouchableOpacity } from 'react-native'
import styles from '../../assets/styles/create.styles'
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';

export default function renderRating({rating, setRating, isLoading}){
    const stars = [];
    for(let i = 1; i <=5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starButton} disabled={isLoading}>
        {i <= rating ? (<Ionicons name="star" size={28} color="orange"/>)
        :(<Ionicons name="star-outline" size={28} color={COLORS.textSecondary}/>)}
        </TouchableOpacity>
      )
    }

    return (
      <View style={styles.ratingContainer}>
        {stars}
      </View>
    )
  }