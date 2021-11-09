import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useAsyncEffect } from "use-async-effect";
import {
  Dimensions,
  View,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Text, Toast, Box, Image } from "native-base";
import { postActions } from "../redux/actions";
import Loading from "../components/Loading";
import toasts from "../redux/helpers/toasts";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

function HomeScreen() {
  const [mounted, setMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState([]);
  // const getImageSize = (image) => {
  //   const { width } = Dimensions.get('window');
  //   const height = image.offsetHeight / (image.offsetWidth / width);
  //   return { width, height };
  // };

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
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {posts.map(
          (post) => (
            console.log("Dans post"),
            console.log(post),
            (
              <Box key={post.id} width="100%">
                <Box
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    marginTop: "3%",
                    marginBottom: "5%",
                  }}
                >
                  <Image
                    source={{
                      uri:
                        "https://epigrambe.herokuapp.com" +
                        post.author.profile_picture,
                    }}
                    width="8%"
                    height="100%"
                    style={{
                      marginLeft: "2%",
                      borderRadius: 20,
                      marginTop: "1%",
                    }}
                    alt="test"
                  />
                  <Text style={{ marginTop: "2%", marginLeft: "3%" }}>
                    {post.author.username}
                  </Text>
                </Box>
                <Image
                  source={{ uri: post.image }}
                  alt="Post Image"
                  width={Dimensions.get('window').width}
                  height={Dimensions.get('window').width}
                />
                <Box style={{ flexDirection: "row" }}>
                  <Text style={{ marginTop: "2%", marginLeft: "3%" }}>
                    {post.author.username}
                  </Text>
                  <Text style={{ marginTop: "2%", marginLeft: "3%" }}>
                    {post.caption}
                  </Text>
                </Box>
              </Box>
            )
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
export default HomeScreen;

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    setParams: PropTypes.func.isRequired,
    state: PropTypes.shape({
      key: PropTypes.string.isRequired,
      routeName: PropTypes.string.isRequired,
      path: PropTypes.string,
      params: PropTypes.objectOf(PropTypes.object),
    }),
  }).isRequired,
};
