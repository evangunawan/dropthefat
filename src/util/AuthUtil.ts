import * as firebase from 'firebase/app';
import 'firebase/firestore';
import Cookies from 'universal-cookie';

const cookie = new Cookies();

const checkToken = (cloudTokens: string[]) => {
  const localToken = cookie.get('admin_token');
  const tokenFind = cloudTokens.find((item) => {
    return item === localToken;
  });

  if (tokenFind) {
    return true;
  } else {
    return false;
  }
};

export async function checkAuth() {
  const db = firebase.firestore();
  let result: string[] = [];
  await db
    .collection('admin')
    .doc('account')
    .get()
    .then((doc) => {
      if (doc.exists) {
        result = [...doc.data()?.token];
      }
    });
  // setAdminToken(result);
  if (cookie.get('admin_token') === '' || checkToken(result) === false) {
    return false;
  }
  return true;
}
