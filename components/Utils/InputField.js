import { View, Text, TextInput } from 'react-native'
import React from 'react'
import styles from '../../assets/styles/login.styles'
import COLORS from '../../constants/colors'
import { Ionicons } from '@expo/vector-icons';
export default function inputField({label, leftIconName, value, onChangeText, placeholder, keyboardType, rightIcon, showDetails, onPress}) {
    return(
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputContainer}>
              {/*Left*/}
              <Ionicons name={leftIconName} size={20} color={COLORS.primary} style={styles.inputIcon}/>
              
              {/*Input*/}
              <TextInput 
                style={styles.input} 
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={!showDetails}
                autoCapitalize="none"
                keyboardType={keyboardType}/>
                
              
              {/*Right*/}
              {rightIcon && <Ionicons name={showDetails ? "eye-outline" : "eye-off-outline"} size={20} color={COLORS.primary} style={styles.inputIcon} onPress={onPress}/>}
            </View>
        </View>
    )
}
