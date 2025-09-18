import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { Styles } from '../lib/styles';
import { colors } from '../lib/colors';
import { deleteIcon, uploadIcon } from '../assets';
import { pick, types } from '@react-native-documents/picker';
import { UploadItemType } from '../types/types';
import { fonts } from '../lib/fonts';
import UploadItem from './UploadItem';
import BackgroundService from 'react-native-background-actions';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { getMediaPermission, getNotificationPermission } from '../lib/utils';
import { BASE_URL } from '@env';

const FIleUpload = () => {
  const [files, setFiles] = useState<UploadItemType[]>([]);

  const filePick = async () => {
    try {
      const [result] = await pick({
        mode: 'open',
        allowMultiSelection: true,
        allowVirtualFiles: true,
        transitionStyle: 'flipHorizontal',
        type: [types.allFiles],
      });
      if (result?.size) {
        setFiles(arr => [
          ...arr,
          {
            name: result?.name || '',
            path: result?.uri || '',
            type: result?.type || '',
            size: result?.size || 0,
            loading: false,
            key: Date.now(),
          },
        ]);
      }
    } catch (error) {
      console.error('File Pick', error);
    }
  };

  const removeItem = (key: number) => {
    const arr = files.filter(x => x.key !== key);
    setFiles(arr);
  };

  const handleUpload = async (item: UploadItemType) => {
    try {
      const options = {
        taskName: `${item.name} upload`,
        taskTitle: 'Uploading',
        taskDesc: `${item.name} is start uploading`,
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
        async () => await uploadAction(item),
        options,
      );
    } catch (error) {
      console.error('Handle Upload', error);
    }
  };

  const uploadAction = async (item: UploadItemType) => {
    try {
      let medPer = await getMediaPermission();
            let notPer = await getNotificationPermission();
      if (medPer && notPer) {
        let arr = files.map(x => {
          if (item.key === x.key) {
            return { ...x, loading: true };
          }
          return x;
        });
        setFiles(arr);

        await ReactNativeBlobUtil.fetch(
          'POST',
          `${BASE_URL}/fileUpload`,
          {
            'Content-Type': 'multipart/form-data',
          },
          [
            {
              name: 'file',
              filename: item.name,
              type: item.type,
              data: ReactNativeBlobUtil.wrap(item.path.replace('file://', '')),
            },
          ],
        )
          .uploadProgress({ interval: 250 }, async (written, total) => {
            const percent = Math.round((written / total) * 100);
            await BackgroundService.updateNotification({
              taskTitle: 'Uploading',
              taskDesc: `${item.name} is ${percent}% uploaded`,
              progressBar: {
                max: 100,
                value: percent,
                indeterminate: false,
              },
            });
          })
          .then(async res => {
            await BackgroundService.updateNotification({
              taskTitle: 'Uploaded',
              taskDesc: `${item.name} uploaded successfully`,
            });
          })
          .catch(err => {
            console.error('Upload error:', err);
          });
      }
    } catch (error) {
      console.error('Upload Action', error);
    } finally {
      let arr = files.map(x => {
        if (item.key === x.key) {
          return { ...x, loading: false };
        }
        return x;
      });
      setFiles(arr);
    }
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: UploadItemType;
    index: number;
  }) => {
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
        <Text style={[Styles.fs14, Styles.flex, { color: colors.text }]}>
          {item.name}
        </Text>
        {item?.loading ? (
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
            onPress={() => handleUpload(item)}
          >
            <Image source={uploadIcon} style={[styles.icon]} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.iconContainer,
            Styles.alignItemsCenter,
            Styles.justifyContentCenter,
          ]}
          onPress={() => removeItem(item.key)}
        >
          <Image source={deleteIcon} style={[styles.icon]} />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={[Styles.flex]}>
      <TouchableOpacity
        style={[
          styles.inputContainer,
          Styles.bw1,
          Styles.br1,
          Styles.flexRow,
          Styles.alignItemsCenter,
          Styles.justifyContentCenter,
          Styles.cg4,
          Styles.mb4,
          { borderColor: colors.black },
        ]}
        onPress={filePick}
      >
        <Text>Select File</Text>
        <Image source={uploadIcon} style={styles.icon} />
      </TouchableOpacity>
      {files.length > 0 ? (
        <Text
          style={[
            Styles.fs20,
            Styles.mb4,
            Styles.textAlignCenter,
            fonts.heavy,
            { color: colors.primary },
          ]}
        >
          Files
        </Text>
      ) : null}
      <FlatList data={files} renderItem={renderItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    height: 44,
  },
  iconContainer: {
    height: 44,
    width: 44,
  },
  icon: {
    height: 24,
    width: 24,
  },
});

export default FIleUpload;
