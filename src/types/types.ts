export interface DownloadItemType {
  url: string;
  name: string;
}

export interface UploadItemType {
  path: string;
  name: string;
  type: string;
  size: number;
  loading: boolean;
  key: number;
}
