const baseURL = import.meta.env.VITE_SERVER_URL;

export async function convertToJson(res) {
  //body of the response from the server that converted to JSON
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    /*use Error() object's name and message properties to send response body
    back to calling funciton*/
    throw {
      name: "servicesError",
      message: jsonResponse,
    };
  }
}

export default class ExternalServices {
  constructor(category) {
    this.category = category;
    this.path = `../json/${this.category}.json`;
  }
  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => data);
  }
  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }

  async checkout(payload) {
    return fetch(`${baseURL}checkout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then(convertToJson);
  }
}
