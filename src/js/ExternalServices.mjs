const baseURL = import.meta.env.VITE_SERVER_URL;

const checkoutURL =
  "https://wdd330-backend-osp8.onrender.com/checkout";

const categories = [
  "tents",
  "sleeping-bags",
  "backpacks",
  "hammocks",
];

async function convertToJson(response) {
  const jsonResponse = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      jsonResponse?.message ||
      jsonResponse?.Message ||
      `HTTP Error: ${response.status}`,
    );

    error.name = "servicesError";
    error.details = jsonResponse;
    error.status = response.status;

    throw error;
  }

  return jsonResponse;
}

export default class ExternalServices {
  async fetchCategory(category) {
    const searchTerm = encodeURIComponent(category);

    const response = await fetch(
      `${baseURL}products/search/${searchTerm}`,
    );

    const data = await convertToJson(response);
    const result = data?.Result;

    if (Array.isArray(result)) {
      return result;
    }

    if (result && typeof result === "object") {
      return [result];
    }

    return [];
  }

  async getData(category) {
    const searchTerm = category.trim().toLowerCase();

    if (categories.includes(searchTerm)) {
      return this.fetchCategory(searchTerm);
    }

    const categoryResults = await Promise.all(
      categories.map((item) => this.fetchCategory(item)),
    );

    const allProducts = categoryResults.flat();

    const uniqueProducts = [
      ...new Map(
        allProducts.map((product) => [product.Id, product]),
      ).values(),
    ];

    return uniqueProducts.filter((product) => {
      const searchableText = [
        product.Name,
        product.NameWithoutBrand,
        product.Brand?.Name,
        product.DescriptionHtmlSimple,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchTerm);
    });
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);

    return data.Result;
  }

  async checkout(order) {
    const response = await fetch(checkoutURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    return await convertToJson(response);
  }
}