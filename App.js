import React, { useRef, useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import { readAsStringAsync } from 'expo-file-system';

const html = 
`
<meta name="viewport" content="width=device-width">
<h1>Hello world! I am HTML string</h1>
`;

export default function App() {
  const [fetchedHtml, setFetchedHtml] = useState('');
  const [webviewLoaded, setWebviewLoaded] = useState(false);

  // define a usecallback for the readfile function
  const readFile = useCallback(() => {
    Promise.resolve().then(async () => {
      const [{ localUri }] = await Asset.loadAsync(require('./src/test.html'));
      console.log("localUri:", localUri);
      if (localUri) {
        readAsStringAsync(localUri).then(contents => {
          if (contents.length == 0) {
            throw new Error('Fetched file is empty.');
          }
      console.log('Fetched file type:', typeof(contents))
          setFetchedHtml(contents);
        });
      }
    })
      .finally(() => console.log(('Fetched html file.')))
      .catch(err => {
        console.error('Error fetching file:', err);
      })
  }, []);

  // read the file in the first render itself
  useEffect(() => {
    readFile()
  }, []);


  // defining the context of the webview
  const webViewRef = useRef(null);
  /**
   * @function handleMessage
   * @param {String} message
   * @description this is the message from the react PWA. Need to handle it here
   */

  const handleMessage = (message = null) => {
    // provide a switch case statament here handling all the helia events
    console.log('message from webview:', message?.nativeEvent?.data);
  }
  /**
   * @function sendMsgToPWA
   * @description send a message from the react native app to the PWA app inside the webview
   * @description this method will also be fired when the web view loaded successfully - did 
   * mount first time - onLoad property in <WebView>
   * 
   */

  const sendMsgToPWA = () => {
    if (webViewRef?.current) {
      webViewRef?.current?.postMessage("Hi to React - from React Native");
    }
  }

  /**
   * @function handleLoadEnd
   * @description this function will be triggered after the webview has been loaded
   */
  const handleLoadEnd = () => {
    console.log('webview loaded');
    setWebviewLoaded(true);
  }


  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden />
      {typeof(fetchedHtml) == 'string' && fetchedHtml.length !== 0 && 
        <WebView style={styles.webView}
          originWhiteList={['*']}
          source={{ html: fetchedHtml }}
          // startInLoadingState
          scrollEnabled={false}
          javaScriptEnabled
          domStorageEnabled
          onMessage={handleMessage}
          onLoadEnd={handleLoadEnd}
          cacheEnabled
          thirdPartyCookiesEnabled
          allowsProtectedMedia
          allowUniversalAccessFromFileURLs
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
        />
      }
    </View>
  );
}


const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#fff',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  webView: {
    flex: 1,
    borderWidth: 5,
    borderColor: 'blue'
  }
});