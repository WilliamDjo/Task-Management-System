export const isNone = value => value === null || value === undefined;

// Fetches with the route, method, body (optional). toast is only required if an error message is to
// be displayed on screen. onSuccess and onFailure are optional functions to be run onSuccess (i.e.
// if no error and success from server) and onFailure (a server error or success is false from the
// server)
export const fetchBackend = async (
  route,
  method,
  body,
  toast,
  onSuccess,
  onFailure
) => {
  // delay of 2 seconds
  const delay = 100;

  // All of your original code is wrapped inside a setTimeout function
  setTimeout(async () => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (!isNone(body)) {
      if ('token' in body) {
        options.headers.Authorization = `Bearer ${body.token}`;
      }
      if (method !== 'GET') {
        options.body = JSON.stringify(body);
      }
    }

    const response = await fetch(`http://127.0.0.1:6969${route}`, options);

    if (!response.ok) {
      if (!isNone(toast)) {
        toast({
          title: `Error ${response.status}`,
          description: response.statusText,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }

      if (!isNone(onFailure)) {
        onFailure();
      }
      return;
    }

    const data = await response.json();

    let isSuccess = false;
    if (!isNone(data.Success)) {
      isSuccess = data.Success;
    } else {
      isSuccess = data.Succes;
    }

    if (!isSuccess) {
      console.log(data);
      let errorMessage = 'Error!';
      if (!isNone(data.Error)) {
        errorMessage = data.Error;
      } else if (!isNone(data.Message)) {
        errorMessage = data.Message;
      }
      if (!isNone(toast)) {
        toast({
          title: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }

      if (!isNone(onFailure)) {
        onFailure(data);
      }
      return;
    }

    if (!isNone(onSuccess)) {
      onSuccess(data);
    }
  }, delay);
};
