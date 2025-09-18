import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
} from 'react';
import { DownloadItemType, UploadItemType } from '../types/types';
import { colors } from '../lib/colors';
import ReactNativeBlobUtil from 'react-native-blob-util';
import BackgroundService from 'react-native-background-actions';
import {
  getMediaPermission,
  getNotificationPermission,
  getMediaWritePermission,
} from '../lib/utils';
import { Alert } from 'react-native';

interface AppContextType {
  handleDownload: (item: DownloadItemType) => void;
  handleUpload: (item: UploadItemType) => void;
}

const InitialValue: AppContextType = {
  handleDownload: () => {},
  handleUpload: () => {},
};

const AppContext = createContext<AppContextType>(InitialValue);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const handleDownload = async (item: DownloadItemType) => {
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
        async () => await downloadAction(item),
        options,
      );
    } catch (error) {
      console.error('Download background ===>', error);
    }
  };

  const downloadAction = useCallback(async (item: DownloadItemType) => {
    try {
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
    }
  }, []);

  const handleUpload = async (item: UploadItemType) => {
    const options = {
      taskName: 'FileUpload',
      taskTitle: 'Uploading File',
      taskDesc: 'Progress',
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
      },
      color: colors.primary,
      linkingURI: 'uploadFile',
    };
    await BackgroundService.start(() => uploadAction(item), options);
  };

  const uploadAction = async (item: UploadItemType) => {
    try {
      await ReactNativeBlobUtil.fetch(
        'POST',
        'http://sjjd',
        {
          'Content-Type': 'multipart/form-data',
        },
        [
          {
            name: 'file', // must match your server field name
            filename: item.path.split('/').pop(),
            data: ReactNativeBlobUtil.wrap(item.path),
          },
        ],
      )
        .uploadProgress({ interval: 100 }, async (written, total) => {
          if (total > 0) {
            const percentage = Math.floor((written / total) * 100);
            await BackgroundService.updateNotification({
              taskTitle: 'File Uploading',
              taskDesc: `${item.name} is ${percentage}% uploaded`,
              progressBar: {
                max: 100,
                value: percentage,
                indeterminate: false,
              },
            });
          } else {
            // fallback when size is unknown
            console.log(`Downloaded: ${written} bytes (total size unknown)`);
          }
        })
        .then(async () => {
          await BackgroundService.updateNotification({
            taskDesc: `${item.name} is downloaded successefully`,
            progressBar: {
              max: 100,
              value: 100,
              indeterminate: false,
            },
          });
          await BackgroundService.stop();
        })
        .catch(err => {
          console.error('Upload failed:', err);
        });
    } catch (error) {
      console.log('Upload action error:', error);
    }
  };

  return (
    <AppContext.Provider value={{ handleDownload, handleUpload }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppcontext = () => useContext(AppContext);

export { useAppcontext, AppProvider };
