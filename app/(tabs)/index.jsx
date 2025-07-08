import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../assets/styles/home.styles'
import { Image } from 'expo-image';
import COLORS from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import DisplayRating from '../../components/Utils/DisplayRating';
import date from '../../components/Functions/date';

export default function Index() {
  //Defining dynamic states
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  //Defining functions
  const getToken = async () => {
  return await AsyncStorage.getItem('token');
  };
  const token = getToken();

  //Fetching books
  const fetchBooks = async (pageNum=1) => {
    try {
      //Showing Loader only on first page
       if (pageNum === 1){
        setIsLoading(true);
      }

      //Fetching data
      const response = await fetch(`https://bookish-bu7u.onrender.com/api/books?page=${pageNum}&limit=2`);

      const data = await response.json();
      if(!response.ok){
        throw new Error(data.message);
      }

      //setBooks((prevBooks)=>[...prevBooks, ...data.books]);
      const uniqueBooks= pageNum === 1 ? 
        data.books : 
        Array.from(new Set([...books, ...data.books].map((book) => book._id))).
        map((id)=>[...books, ...data.books].find((book) => book._id === id));
      
      //Updating states
      setBooks(uniqueBooks);
      setHasMore(pageNum<data.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.log("Error while fetching books",error);
    }finally{
      setIsLoading(false);
    } 
  }

  useEffect(() => {
    fetchBooks();
  }, []);
  
  //Load more books
  const handleLoadMore = async () => {
     if(hasMore){
       fetchBooks(page+1);
     }
  };

  //Refresh books
  const handleRefresh = async () => {
    setRefreshing(true);
    fetchBooks(1);
    setRefreshing(false);
  }

  //Rendering books
  const renderItem = ({ item }) => {
    return (
      <View style={styles.bookCard}>
        <View style={styles.bookHeader}>
          <View style={styles.userInfo}>
            <Image source={{ uri: item.user.profileImage}} style={styles.avatar} />
            <Text style={styles.username}>{item.user.username}</Text>
          </View>
        </View>

        <View style={styles.bookImageContainer}>
          <Image source={{ uri: item.image }} style={styles.bookImage} contentFit="cover"/>
        </View>

        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <View style={styles.ratingContainer}>{DisplayRating(item.rating)}</View>
          <Text style={styles.caption}>{item.caption}</Text>
          <Text style={styles.date}>Shared on  {date(item.createdAt)}</Text>
        </View>
      </View>
    )
  };

  
  if(isLoading && !refreshing){
    return(
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }
  
  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      
        //List Header
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Bookish 📚</Text>
            <Text style={styles.headerSubtitle}>Discover and share your favorite books</Text>
          </View>
        }
        
        //List Footer
        ListFooterComponent={
          hasMore && books.length>0 ?
          (<ActivityIndicator style ={styles.footerLoader} size="small" color={COLORS.primary}/> ) : null
        }

        //List Empty
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name='book-outline' size={50} color={COLORS.textSecondary}/>
            <Text style={styles.emptyText}>No books found</Text>
            <Text style={styles.emptySubtext}>Try refreshing the page</Text>
          </View>
        }

        //refresh
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} 
            color={COLORS.primary} tintColor={COLORS.primary}/>
        }
      />
    </View>
  )
}