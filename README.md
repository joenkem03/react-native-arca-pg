# react-native-arca-pg

handling integration to ARCA payment gateway for react-native projects

## Installation

```sh
npm install react-native-arca-pg
```

## Usage


```js
import {  CreateOrder, PayOrder, VerifyOrder, Checkout, PayOrderApiRequest, CreateOrderApiRequest, PayOrderEncrypt, CreateOrderEncrypt  } from 'react-native-arca-pg';

// ...


const newOrder = await CreateOrder({ 
  first_name: "test", 
  last_name: "tester", 
  mobile: "+2348101234544", 
  country: "NG", 
  email: "joe@techdev.work", 
  amount: 10, 
  reference: "{{unique_transRef}}", 
  description: "Pay", 
  currency: "USD", 
  merchant_encryption_key: "merchant_enc_key", 
  pub_key: "api_pub_key" }) // creates new order, handling both encryption and sending the API request

const payload = {
            reference: "unique_transRef", //same unique transRef from create order function
            country: "NG",
            card: "{{card_pan}},
            cvv: "{{card_cvv}}",
            expiry_month: "{{card_expiry_month}}", // MM
            expiry_year: "{{card_expiry_year}}", // YY
            pub_key: "api_pub_key",
            merchant_encryption_key: "merchant_enc_key"
        }
const orderPayment = await PayOrder(payload) // Process card payment for order



const orderConfirmation = await VerifyOrder({reference: "{{orderRef}}", priv_key: "api_sec_key"}) // verfy order payment.  orderRef = unique_transRef


To make us of arca-pg's checkout for card details collection; 
- Add the "Checkout" function to your navigation
- Navigate to the checkout screen as shown below
    navigation.navigate('Checkout', { order: orderCreated, apiKey: api_pub_key, encKey: merchant_enc_key, onGoBack: (response) => completePayOrder(response) })
    This will call the "PayOrder" function and return response with the onGoBack "callback" function. 
- Implement a completePayOrder function to receive the response payload. 
- If the transaction is processed as a 3D transaction (with Authentication). YOu are to launch a returned url in the response from the PayOrder call. See sample of below


  const completePayOrder = async (response) => {

    console.log('pay response ', response)

    if (response.data.payment_detail.redirect_url !== 'N/A') {
      setIframeLink(response.data.payment_detail.redirect_url) // sets iframe link
      setIframeVisible(!iframeVisible) // launches iframe. See example code for complete implementation
    }
  }



  ADDITIONAL FUNCTIONS

  CreateOrderEncrypt({
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
    }) // Only encrypts the plain "Create Order" payload

  CreateOrderApiRequest( encrypted_orderPayload_string, api_pub_key) // Only handles sending API request for Create Order

  PayOrderEncrypt({
      reference: orderRefCreated,
      country: 'US',
      card: '5123450000000008',
      cvv: '100',
      expiry_month: '01',
      expiry_year: '39',
      pub_key: api_pub_key,
      merchant_encryption_key: merchant_enc_key,
    }) // Only encrypts the plain "Pay Order" payload
    
  PayOrderApiRequest( encrypted_paymentPayload_string, api_pub_key) //  Only handles sending API request for Pay Order
```


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
