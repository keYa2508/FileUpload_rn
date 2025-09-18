import { PermissionsAndroid } from 'react-native';

export const getMediaPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      'android.permission.READ_MEDIA_IMAGES',
    );
    if (granted === 'granted') {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Get Media Permission Error ===>', error);
  }
};

export const getMediaWritePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      'android.permission.WRITE_EXTERNAL_STORAGE',
    );
    if (granted === 'granted') {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Get Media Write Permission Error ===>', error);
  }
};

export const getNotificationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      'android.permission.POST_NOTIFICATIONS',
    );
    if (granted === 'granted') {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Get Notification Permission Error ===>', error);
  }
};
