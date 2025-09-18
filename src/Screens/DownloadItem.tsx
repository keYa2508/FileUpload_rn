import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { DownloadItemType } from '../types/types';
import { Styles } from '../lib/styles';
import { colors } from '../lib/colors';
import { deleteIcon, downloadIcon } from '../assets';
import { useAppcontext } from '../context';
import { getMediaPermission, getNotificationPermission } from '../lib/utils';
import ReactNativeBlobUtil from 'react-native-blob-util';
import BackgroundService from 'react-native-background-actions';

interface Props {
  item: DownloadItemType;
  index: number;
}

const DownloadItem: React.FC<Props> = ({ item, index }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [avl, setAvl] = useState<boolean>(false);

  const handleDownload = async () => {
    try {
      const options = {
        taskName: 'Downloading',
        taskTitle: 'Downloading',
        taskDesc: `${item.name} is start downloading`,
        taskIcon: {
          name: 'ic_launcher',
          type: 'mipmap',
          package: 'com.fileupload',
        },
        color: colors.primary,
        parameters: {
          delay: 100,
        },
      };

      await BackgroundService.start(
        async () => await downloadAction(),
        options,
      );
    } catch (error) {
      console.error('Download background ===>', error);
    }
  };

  const downloadAction = useCallback(async () => {
    try {
      setLoading(true);
      let medPer = await getMediaPermission();
      let notPer = await getNotificationPermission();
      if (medPer && notPer) {
        await ReactNativeBlobUtil.config({
          addAndroidDownloads: {
            description: `${item.name} is downloading`,
            storeLocal: true,
            mediaScannable: true,
            notification: true,
            storeInDownloads: true,
            useDownloadManager: true,
            title: item.name,
          },
        })
          .fetch('GET', item.url)
          .then(async res => Alert.alert(`${item.name} download successfully`))
          .catch(e => {
            console.log('Download error ===>', e);
          });
      }
    } catch (error) {
      console.error('Download Action ===>', error);
    } finally {
      setLoading(false);
    }
  }, [item.name, item.url]);

  const checkFileIn = async () => {
    const path = `${ReactNativeBlobUtil.fs.dirs.LegacyDownloadDir}/${item.name}`;
    const exists = await ReactNativeBlobUtil.fs.exists(path);
    setAvl(exists);
  };

  useEffect(() => {
    checkFileIn();
  }, [loading]);

  const deleteAction = async () => {
    try {
      setLoading(true);
      const path = `${ReactNativeBlobUtil.fs.dirs.LegacyDownloadDir}/${item.name}`;
      await ReactNativeBlobUtil.fs.unlink(path);
    } catch (error) {
      console.error('Delete Error', error);
    }
    setLoading(false);
  };
  return (
    <View
      key={index}
      style={[
        Styles.pl4,
        Styles.flexRow,
        Styles.alignItemsCenter,
        Styles.justifyContentSpaceBetween,
        Styles.bw1,
        Styles.br1,
        Styles.mb4,
        { borderColor: colors.border },
      ]}
    >
      <Text style={[Styles.fs14, { color: colors.text }]}>{item.name}</Text>
      {loading ? (
        <View
          style={[
            styles.iconContainer,
            Styles.alignItemsCenter,
            Styles.justifyContentCenter,
          ]}
        >
          <ActivityIndicator size={24} color={colors.primary} />
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.iconContainer,
            Styles.alignItemsCenter,
            Styles.justifyContentCenter,
          ]}
          onPress={avl ? deleteAction : handleDownload}
        >
          <Image
            source={avl ? deleteIcon : downloadIcon}
            style={[styles.icon]}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    height: 44,
    width: 44,
  },
  icon: {
    height: 24,
    width: 24,
  },
});

export default React.memo(DownloadItem);
