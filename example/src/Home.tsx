import { useState } from 'react';
import { Text, View, StyleSheet, Pressable, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  CreateOrder,
  VerifyOrder,
  PayOrderApiRequest,
  CreateOrderApiRequest,
  PayOrderEncrypt,
  CreateOrderEncrypt,
} from 'react-native-arca-pg';

export default function Home({ navigation }: any) {
  const [iframeVisible, setIframeVisible] = useState(false);
  const [iframeLink, setIframeLink] = useState('');
  const [spinner, setSpinner] = useState(false);
  const [showIframeClose, setShowIframeClose] = useState(false);
  const [spinnerText, setSpinnerText] = useState('Processing...');
  const [orderRef, setOrderRef] = useState('');

  const merchant_enc_key = ' ';
  const api_pub_key = ' ';
  const api_sec_key = ' ';
  async function creatingOrder() {
    var transRef = `APG-RN${Math.floor(Math.random() * 10000000)}`;

    const message = {
      first_name: 'test',
      last_name: 'tester',
      mobile: '+2348101234544',
      country: 'US',
      email: 'joe@techdev.work',
      amount: 10,
      reference: transRef,
      description: 'Pay',
      currency: 'USD',
      merchant_encryption_key: merchant_enc_key,
      pub_key: api_pub_key,
    };
    setOrderRef(transRef);
    console.log(message);
    console.log(JSON.stringify(message));
    setSpinner(true);
    setSpinnerText('Creating Order...');
    const newOrder = await CreateOrder(message);
    setSpinner(false);
    console.log('request status ', newOrder);
    return newOrder;
  }

  async function doOrderCheckout() {
    const orderCreated = await creatingOrder();
    console.log('checking out order', orderCreated);
    navigation.navigate('Checkout', {
      order: orderCreated,
      apiKey: api_pub_key,
      encKey: merchant_enc_key,
      onGoBack: (response: any) => completePayOrder(response),
    });
  }

  const completePayOrder = async (response: any) => {
    console.log('pay response ', response);

    if (response.data.payment_detail.redirect_url !== 'N/A') {
      setIframeLink(response.data.payment_detail.redirect_url);
      setIframeVisible(!iframeVisible);
    }
  };

  async function closePaymentAuthPage() {
    setIframeVisible(!iframeVisible);
    setShowIframeClose(false);
    verifyOrderPayment();
  }

  async function verifyOrderPayment() {
    setSpinner(true);
    setSpinnerText('Verifying Order Payment...');
    const orderConfirmation = await VerifyOrder({
      reference: orderRef,
      priv_key: api_sec_key,
    });
    setSpinner(false);
    console.log('payment status: ', orderConfirmation);
    console.log('payment info: ', orderConfirmation.data.order_payments);
  }

  function enableShowCloseBtn() {
    setTimeout(() => {
      setShowIframeClose(true);
    }, 10000);
  }

  function encryptOrder() {
    var transRef = `APG-RN${Math.floor(Math.random() * 10000000)}`;

    const message = {
      first_name: 'test',
      last_name: 'tester',
      mobile: '+2348101234544',
      country: 'US',
      email: 'joe@techdev.work',
      amount: 10,
      reference: transRef,
      description: 'Pay',
      currency: 'USD',
      merchant_encryption_key: merchant_enc_key,
      pub_key: api_pub_key,
    };
    setOrderRef(transRef);
    console.log(message);
    console.log(JSON.stringify(message));
    setSpinner(true);
    setSpinnerText('Encrypting Order...');
    const orderEnc = CreateOrderEncrypt(message);
    setSpinner(false);
    console.log('Encrypted payload: ', orderEnc);
    return orderEnc;
  }

  function encryptPayOrder(orderRefCreated: string) {
    const message = {
      reference: orderRefCreated,
      country: 'US',
      card: '5123450000000008',
      cvv: '100',
      expiry_month: '01',
      expiry_year: '39',
      pub_key: api_pub_key,
      merchant_encryption_key: merchant_enc_key,
    };
    console.log(message);
    console.log(JSON.stringify(message));
    setSpinner(true);
    setSpinnerText('Encrypting Order...');
    const paymentEnc = PayOrderEncrypt(message);
    setSpinner(false);
    console.log('Encrypted payOrder payload: ', paymentEnc);
    return paymentEnc;
  }

  async function sendEncryptedCreateOrderRequest(orderPayload: string | false) {
    console.log(orderPayload);
    console.log(JSON.stringify(orderPayload));
    setSpinner(true);
    setSpinnerText('Processing Create Order API request...');
    const orderResponse = await CreateOrderApiRequest(
      orderPayload.toString(),
      api_pub_key
    );
    setSpinner(false);
    console.log('Create Order API response: ', orderResponse);
    return orderResponse;
  }

  async function sendEncryptedPayOrderRequest(paymentPayload: string | false) {
    console.log(paymentPayload);
    console.log(JSON.stringify(paymentPayload));
    setSpinner(true);
    setSpinnerText('Processing Pay Order API request...');
    const paymentResponse = await PayOrderApiRequest(
      paymentPayload.toString(),
      api_pub_key
    );
    setSpinner(false);
    console.log('Pay Order API response: ', paymentResponse);
    return paymentResponse;
  }

  async function testFunctions() {
    // throw new Error('Function not implemented.');
    const orderPayload = encryptOrder();
    const orderResponse = await sendEncryptedCreateOrderRequest(orderPayload);
    const paymentPayload = encryptPayOrder(orderResponse.data.order.reference);
    const response = await sendEncryptedPayOrderRequest(paymentPayload);

    completePayOrder(response);
  }

  return (
    <>
      <View style={styles.container}>
        <Spinner
          visible={spinner}
          textContent={spinnerText}
          textStyle={styles.sipnnerText}
        />

        {iframeVisible ? (
          <View style={styles.centeredView}>
            <WebView
              // scalesPageToFit={true}
              bounces={false}
              javaScriptEnabled
              source={{
                html: `<iframe width="100%" height="100%" src="${iframeLink}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`,
              }}
              style={styles.iframe}
              injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=width, initial-scale=0.5, maximum-scale=0.5, user-scalable=2.0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
              scalesPageToFit={false}
              onLoad={() => console.log('loaded')}
              onLoadEnd={() => enableShowCloseBtn()}
              // onLoadStart={() => console.log('load started')}
            />
            {showIframeClose && (
              <View>
                <Pressable
                  style={[styles.button]}
                  onPress={() => closePaymentAuthPage()}
                >
                  <Text style={styles.buttonText}> Close </Text>
                </Pressable>
              </View>
            )}
          </View>
        ) : (
          <View>
            {/* <View style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-start", marginTop: 15 }}>
              <Text style={{ fontSize: 26, fontWeight: 600, color: "#101010" }}>
                Test Checkout
              </Text>
            </View> */}

            <Pressable
              style={[styles.button]}
              onPress={() => doOrderCheckout()}
            >
              <Text style={styles.buttonText}>Demo Checkout </Text>
            </Pressable>

            <Pressable style={[styles.button]} onPress={() => testFunctions()}>
              <Text style={styles.buttonText}>Test Functions </Text>
            </Pressable>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sipnnerText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    height: 50,
    backgroundColor: '#0048B1',
    margin: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    elevation: 2,
    padding: 15,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 600,
    color: 'white',
    textAlign: 'center',
  },
  iframe: {
    height: (Dimensions.get('window').height * 70) / 100,
    width: Dimensions.get('window').width,
    resizeMode: 'cover',
    flex: 1,
  },
});
