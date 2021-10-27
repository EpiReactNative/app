import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Dimensions } from 'react-native';
import _ from 'lodash';
import {
  Stack, Text, TextArea, Image, Divider,
} from 'native-base';
import { uploadConstants } from '../../redux/constants';

function PublicationScreen({ route }) {
  const dispatch = useDispatch();
  const width = Dimensions.get('window').width - 80;
  const height = route.params.image.height / (route.params.image.width / width);
  const [image, setImage] = useState(null);

  const handleChange = _.debounce((caption) => {
    dispatch({ type: uploadConstants.UPLOAD_STORE, image, caption });
  }, 250);

  useEffect(() => {
    handleChange('');
    if (route.params.image.base64) {
      setImage(`data:image/jpeg;base64,${route.params.image.base64}`);
    } else {
      setImage(route.params.image.uri);
    }
  }, [handleChange, route]);

  return (
    <Stack space={4} w="100%" h="100%" p="10" alignItems="center">
      {route.params.image
        && (
          <Stack>
            <Text mb="2" bold fontSize="md">Légende</Text>
            <TextArea
              mb="4"
              textAlignVertical="top"
              placeholder="Ajouter une légende..."
              onChangeText={handleChange}
            />
            <Divider />
            <Image
              resizeMode="cover"
              source={{ uri: route.params.image.uri }}
              width={width}
              height={height}
              alt="Publication Image"
            />
          </Stack>
        )}
    </Stack>
  );
}

export default PublicationScreen;

PublicationScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      image: PropTypes.shape({
        uri: PropTypes.string,
        base64: PropTypes.string,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};
