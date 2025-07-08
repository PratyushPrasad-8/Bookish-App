import { View, Text, Alert, Touchable, FlatList, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import styles from '../../assets/styles/profile.styles'
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileHeader from '../../components/Utils/ProfileHeader';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { Image } from 'expo-image';
import DisplayRating from '../../components/Utils/DisplayRating';
import date from '../../components/Functions/date';
import { RefreshControl } from 'react-native';

export default function Profile() {
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const[deletedBookId, setDeletedBookId] = useState(null);


  const router = useRouter();

  const confirmLogout = () => {
  Alert.alert(
    'Logout',
    'Are you sure you want to logout?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          router.replace("(auth)");
        },
        style: 'destructive',
      },
    ],
    { cancelable: false }
  )}

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await fetch('https://bookish-bu7u.onrender.com/api/books/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      setUser(data.user);
      setBooks(data.books);

      if(!response.ok){
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (id) => {
    Alert.alert(
      'Delete Book',
      'Are you sure you want to delete this book?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            handleDeleteBook(id)
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const handleDeleteBook = async (id) => {
    try {
      setDeletedBookId(id);
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`https://bookish-bu7u.onrender.com/api/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if(!response.ok){
        throw new Error(data.message);
      }
      Alert.alert('Success', 'Book deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting book:', error);
      Alert.alert('Error', error.message);
    } finally {
      setDeletedBookId(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Image source= {item.image}  style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>{DisplayRating(item.rating)}</View>
        <Text style={styles.bookCaption} numberOfLines={2}>{item.caption}</Text>
        <Text style={styles.bookDate}>Shared on  {date(item.createdAt)}</Text>
      </View>
      
      {deletedBookId === item._id ? 
      (<ActivityIndicator size="small" color={COLORS.primary} />):
      (<TouchableOpacity style={styles.deleteButton} onPress={() =>{confirmDelete(item._id)}}>
        <Ionicons name="trash-outline" size={24} color={COLORS.primary} /> 
      </TouchableOpacity>)}
    </View>
  );

  if(isLoading && !refreshing){
    return(
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      
      <ProfileHeader user={user} />

      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      

      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.booksList}

        ListHeaderComponent={
          <View style={styles.booksHeader}>
            <Text style={styles.booksTitle}>Your Books 📚</Text>
            <Text style={styles.booksCount}>{books.length}</Text>
          </View>
        }
        
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={50} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>You don't have any books yet</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("(tabs)/create")}>
              <Text style={styles.addButtonText}>Add your First Book</Text>
            </TouchableOpacity>
          </View>
        }
        />
    </View>
  )
}   