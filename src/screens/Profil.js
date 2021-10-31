import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import { useSelector } from 'react-redux';
import { useAsyncEffect } from 'use-async-effect';
import {
  Stack, Toast,
} from 'native-base';
import { userActions } from '../redux/actions';
import Loading from '../components/Loading';
import toasts from '../redux/helpers/toasts';
import { ProfilTopBar, ProfilHeader, ProfilContainer } from '../components/profil';

function ProfilScreen({ id }) {
  // const { selfUser } = useSelector((state) => state.user);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(undefined);

  useAsyncEffect(async (isMounted) => {
    if (isMounted()) {
      userActions.whoami().then((selfuser) => {
        if (id && id !== selfuser.id) {
          userActions.getUser(id).then((data) => {
            setUser(data);
            if (isMounted()) setMounted(true);
          }).catch(() => {
            Toast.show(toasts.globalError);
          });
        } else {
          setUser(selfuser);
          if (isMounted()) setMounted(true);
        }
      }).catch(() => {
        Toast.show(toasts.globalError);
      });
    }
  }, []);

  if (!mounted) {
    return <Loading />;
  }

  return (
    <Stack w="100%" h="100%">
      <ProfilTopBar user={user} />
      <ProfilHeader user={user} />
      <ProfilContainer user={user} />
    </Stack>
  );
}

export default ProfilScreen;

ProfilScreen.propTypes = {
  id: PropTypes.number,
};

ProfilScreen.defaultProps = {
  id: null,
};
