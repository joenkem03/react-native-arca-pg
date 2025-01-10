import { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons'
import { PayOrder } from '../../services/Process';
// import { WebView } from 'react-native-webview'
import Spinner from 'react-native-loading-spinner-overlay';

const Card = ({ cardNumber, expiryMonthYear }: any) => {
  const [expiryMonthYearDisplay, setExpiryMonthYearDisplay] = useState('MM/YY');
  const [cardDisplayNumber, setCardDisplayNumber] = useState(
    '* * * *    * * * *    * * * *'
  );

  useEffect(() => {
    setExpiryMonthYearDisplay(
      expiryMonthYear.trim() === '' ? 'MM/YY' : expiryMonthYear
    );
    setCardDisplayNumber(
      cardNumber.trim() === '' ? '* * * *    * * * *    * * * *' : cardNumber
    );
  }, [cardNumber, expiryMonthYear]);

  return (
    <View style={styles.card}>
      <View />
      <View style={styles.cardIcc}>
        <Image
          source={require('../../assets/card_chip.png')}
          style={styles.cardIccImage}
        />
        <Text style={styles.cardPan}>{cardDisplayNumber}</Text>
        <View style={styles.cardExpiryLogo}>
          <View style={styles.cardExpiry}>
            <Text style={styles.cardExpiryText}>{expiryMonthYearDisplay}</Text>
          </View>
          <View style={styles.cardLogo}>
            <Image
              source={require('../../assets/arca_logo.png')}
              style={styles.cardLogoImage}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const Checkout = ({ navigation, route }: any) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonthYear, setExpiryMonthYear] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [cvv, setCvv] = useState('');
  const [spinnerState, setSpinnerState] = useState(false);
  const [expiryMonthYearDisplay, setExpiryMonthYearDisplay] = useState('MM/YY');
  const [cardDisplayNumber, setCardDisplayNumber] = useState(
    '* * * *    * * * *    * * * *'
  );

  const handleCardProcessingRequest = async () => {
    const payload = {
      reference: route.params.order.data.order.reference,
      country: route.params.order.data.customer.country,
      card: cardNumber.replace(/\s/g, ''),
      cvv: cvv,
      expiry_month: expiryMonth,
      expiry_year: expiryYear,
      pub_key: route.params.apiKey,
      merchant_encryption_key: route.params.encKey,
    };

    // console.log('paying with ', payload)

    // processPayOrder(payload)
    setSpinnerState(true);
    const orderPayment = await PayOrder(payload);
    setSpinnerState(false);

    console.log('pay response ', orderPayment);
    route.params.onGoBack(orderPayment);
    navigation.goBack();
  };

  const formatExpiryMonthYear = (e: any) => {
    const inputValue = e;
    const numericValue = inputValue.replace(/\D/g, '');
    let formattedDisplayValue = '';

    for (let i = 0; i < numericValue.length; i++) {
      if (i > 0 && i % 2 === 0) {
        formattedDisplayValue += '/';
      }
      formattedDisplayValue += numericValue[i];
    }
    const inputValueArray = inputValue.split('/');

    setExpiryMonth(inputValueArray[0]);
    setExpiryYear(inputValueArray[1]);

    setExpiryMonthYear(formattedDisplayValue);
    setExpiryMonthYearDisplay(
      formattedDisplayValue.trim() === '' ? 'MM/YY' : formattedDisplayValue
    );
  };

  const formatCardNumber = (e: any) => {
    const inputValue = e;
    const numericValue = inputValue.replace(/\D/g, '');
    let formattedValue = '';

    for (let i = 0; i < numericValue.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += numericValue[i];
    }

    setCardNumber(formattedValue);
    setCardDisplayNumber(
      formattedValue.trim() === ''
        ? '* * * *    * * * *    * * * *'
        : formattedValue
    );
  };

  return (
    <SafeAreaView style={styles.white}>
      <Spinner
        visible={spinnerState}
        textContent={'Processing Order Payment...'}
        textStyle={styles.sipnnerText}
      />
      <View style={styles.contianerView}>
        <View style={styles.preTitleView} />
        <View style={styles.titleView}>
          <Text style={styles.titleText}>Card Payment</Text>
        </View>
        <Card
          cardNumber={cardDisplayNumber}
          expiryMonthYear={expiryMonthYearDisplay}
        />
        {/* <View style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "start", marginTop: 40 }}>
                    <Text style={{ fontWeight: 400, fontSize: 14, color: "#101010", marginBottom: 6 }}>Cardholder name</Text>
                    <TextInput
                        style={{ borderBottomWidth: 1, borderBottomColor: "grey", padding: 10, fontSize: 16, fontWeight: 600 }}
                        placeholder="Lucky Okirie"
                        placeholderTextColor="#1aacff"
                    />
                </View> */}
        <View style={styles.cardFormRow}>
          <Text style={styles.cardFormInputTitle}>Card number</Text>
          <View style={styles.cardFormRowInput}>
            <TextInput
              style={styles.cardFomPanInput}
              placeholder="0000  0000  0000  0000"
              placeholderTextColor="#f0f0f0"
              value={cardNumber}
              onChangeText={formatCardNumber}
              keyboardType="numeric"
              maxLength={25}
            />
            <Image
              source={require('../../assets/arca_logo.png')}
              style={styles.inputIcon}
            />
          </View>
        </View>
        <View style={styles.cardFormRowEx}>
          <View style={styles.cardFormExpiryCvvInputView}>
            <Text style={styles.cardFormInputTitle}>Exp date</Text>
            <TextInput
              style={styles.cardFormCvvExInput}
              placeholder="MM/YYYY"
              textContentType="none"
              placeholderTextColor="#f0f0f0"
              value={expiryMonthYear}
              onChangeText={formatExpiryMonthYear}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
          <View style={styles.cvvExt} />
          <View style={styles.cardFormExpiryCvvInputView}>
            <Text style={styles.cardFormInputTitle}>CVV</Text>
            <TextInput
              style={styles.cardFormCvvExInput}
              placeholder="123"
              placeholderTextColor="#f0f0f0"
              value={cvv}
              onChangeText={setCvv}
              keyboardType="numeric"
              textContentType="password"
              secureTextEntry={true}
              maxLength={6}
            />
          </View>
        </View>
        <Pressable
          style={[styles.button]}
          onPress={() => handleCardProcessingRequest()}
        >
          <Text style={styles.buttonText}>Pay</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: (Dimensions.get('window').height * 27) / 100,
    backgroundColor: '#0048B1',
    borderRadius: 15,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 15,
    marginTop: 30,
  },
  cardIcc: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    // alignItems: "start"
  },
  cardIccImage: {
    width: 50,
    height: 50,
  },
  cardPan: {
    fontSize: 24,
    fontWeight: 400,
    color: 'white',
  },
  cardExpiryLogo: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardExpiry: {
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 30,
  },
  cardExpiryText: {
    fontSize: 20,
    fontWeight: 400,
    color: 'white',
  },
  cardLogo: {
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cardLogoImage: {
    width: 88,
    height: 40,
    marginTop: 15,
    borderRadius: 5,
  },

  contianerView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
    fontFamily: '"Poppins", sans-serif',
  },
  white: {
    backgroundColor: 'white',
  },
  sipnnerText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  preTitleView: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: "start",
    alignItems: 'center',
  },
  titleView: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 15,
  },
  cardFormRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    // alignItems: "start",
    marginTop: 40,
  },
  cardFormRowEx: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
  },
  cardFormExpiryCvvInputView: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    // alignItems: "start"
  },
  cardFormInputTitle: {
    fontWeight: 400,
    fontSize: 14,
    color: '#101010',
    marginBottom: 6,
  },
  cardFormRowInput: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  cardFomPanInput: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 10,
    fontWeight: 600,
    color: '#0048B1',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    paddingBottom: 10,
    paddingTop: 10,
  },
  cardFormCvvExInput: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 16,
    fontWeight: 600,
    color: '#0048B1',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#0048B1',
    borderRadius: 50,
    marginTop: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 600,
    color: 'white',
    textAlign: 'center',
  },
  titleText: {
    fontSize: 26,
    fontWeight: 600,
    color: '#101010',
  },
  inputIcon: {
    width: 44,
    height: 20,
    marginLeft: 10,
  },
  cvvExt: {
    width: 15,
  },
});

export default Checkout;
