import React, { useState, useCallback } from "react";
import Constants from "expo-constants";
import { Stack, Icon, Input, Toast, Text, Box, Image, } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { postActions } from "../../redux/actions";
import Loading from "../../components/Loading";
import toasts from "../../redux/helpers/toasts";
import { useAsyncEffect } from "use-async-effect";
import {
    Dimensions, RefreshControl, SafeAreaView, ScrollView, StyleSheet,
  } from 'react-native';

  
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
  });
  
const PostGrid = () => {
  const [mounted, setMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState([]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    postActions
      .getPosts()
      .then((data) => {
        setPosts(data);
      })
      .catch(() => {
        Toast.show(toasts.globalError);
      })
      .then(() => setRefreshing(false));
  }, []);

  useAsyncEffect(async (isMounted) => {
    if (isMounted()) {
      postActions
        .getPosts()
        .then((data) => {
          setPosts(data);
          console.log(data);
          if (isMounted()) setMounted(true);
        })
        .catch(() => {
          Toast.show(toasts.globalError);
        });
    }
  }, []);

  if (!mounted) {
    return <Loading />;
  }

  return (
    <Stack>

        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {posts.map((post) => (
            <Box key={post.id} w="33%" m="0.3">
              <Image
                resizeMode="cover"
                source={{ uri: post.image }}
                alt="Post Image"
                width={Dimensions.get("window").width/3}
                height={Dimensions.get("window").width/3}
              />
            </Box>
          ))}
        </ScrollView>
    </Stack>
  );
};

export default PostGrid;
