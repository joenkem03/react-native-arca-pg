export async function createOrder_call(data: any, pub_key: string) {
  const myHeaders = new Headers();
  myHeaders.append('api-key', pub_key);
  myHeaders.append('Content-Type', 'application/json');
  // myHeaders.append("User-Agent", "syntoid");

  const raw = JSON.stringify({
    data: data,
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    // redirect: "follow"
  };

  console.log('---- sending create order request ---');
  console.log(requestOptions);
  console.log('-------------------------------------');

  return fetch(
    'https://checkout-api.arcapg.com/checkout/order/create',
    requestOptions
  )
    .then(async (response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(await handleKnownError(response));
      }
    })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.error(error);
      throw new Error('Something went wrong');
    });
}

export function payOrder_call(data: any, pub_key: string) {
  const myHeaders = new Headers();
  myHeaders.append('api-key', pub_key);
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    data: data,
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    // redirect: "follow"
  };

  return fetch(
    'https://checkout-api.arcapg.com/checkout/order/pay',
    requestOptions
  )
    .then(async (response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(await handleKnownError(response));
      }
    })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.error(error);
      throw new Error('Something went wrong');
    });
}

export function verifyOrder_call(params: any) {
  const myHeaders = new Headers();
  myHeaders.append('api-key', params.priv_key);
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    reference: params.reference,
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    // redirect: "follow"
  };

  console.log(myHeaders);

  return fetch(
    'https://checkout-api.arcapg.com/checkout/order/verify',
    requestOptions
  )
    .then(async (response) => {
      if (response.ok || response.status === 400) {
        return response.json();
      } else {
        throw new Error(await handleKnownError(response));
      }
    })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.error(error);
      throw new Error('Something went wrong');
    });
}

function handleKnownError(response: any) {
  switch (response.status) {
    case 400:
      return response.json().then((msg: { message: any; status_code: any }) => {
        console.log(msg);
        return `${msg.message}. Code: ${msg.status_code}`;
      });
    case 401:
      return response.json().then((msg: { Message: any; StatusCode: any }) => {
        console.log(msg);
        return `${msg.Message}. Code: ${msg.StatusCode}`;
      });

    default:
      return 'Unexpected response';
  }
}
