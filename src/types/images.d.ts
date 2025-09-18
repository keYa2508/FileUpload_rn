declare module '*.png' {
  const value:
    | {
        uri?: string | undefined;
        bundle?: string | undefined;
        method?: string | undefined;
        headers?: { [key: string]: string } | undefined;
        cache?:
          | 'default'
          | 'reload'
          | 'force-cache'
          | 'only-if-cached'
          | undefined;
        body?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        scale?: number | undefined;
      }
    | number;
  export default value;
}

declare module '*.jpg' {
  const value:
    | {
        uri?: string | undefined;
        bundle?: string | undefined;
        method?: string | undefined;
        headers?: { [key: string]: string } | undefined;
        cache?:
          | 'default'
          | 'reload'
          | 'force-cache'
          | 'only-if-cached'
          | undefined;
        body?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        scale?: number | undefined;
      }
    | number;
  export default value;
}

declare module '*.jpeg' {
  const value:
    | {
        uri?: string | undefined;
        bundle?: string | undefined;
        method?: string | undefined;
        headers?: { [key: string]: string } | undefined;
        cache?:
          | 'default'
          | 'reload'
          | 'force-cache'
          | 'only-if-cached'
          | undefined;
        body?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        scale?: number | undefined;
      }
    | number;
  export default value;
}

declare module '*.gif' {
  const value:
    | {
        uri?: string | undefined;
        bundle?: string | undefined;
        method?: string | undefined;
        headers?: { [key: string]: string } | undefined;
        cache?:
          | 'default'
          | 'reload'
          | 'force-cache'
          | 'only-if-cached'
          | undefined;
        body?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        scale?: number | undefined;
      }
    | number;
  export default value;
}

declare module '*.svg' {
  const value:
    | {
        uri?: string | undefined;
        bundle?: string | undefined;
        method?: string | undefined;
        headers?: { [key: string]: string } | undefined;
        cache?:
          | 'default'
          | 'reload'
          | 'force-cache'
          | 'only-if-cached'
          | undefined;
        body?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        scale?: number | undefined;
      }
    | number;
  export default value;
}
