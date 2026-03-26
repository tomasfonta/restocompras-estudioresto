/**
 * Restaurant configuration file.
 * Add an entry per restaurant with its ID and base API URL.
 * The restaurantId is included in the QR code URL as a query param: ?restaurantId=xxx&table=N
 */
const restaurants = {
  // Example restaurant — replace with real endpoints
  demo: {
    name: 'Restaurante Demo',
    apiUrl: 'https://api.demo-restaurante.com',
  },
  estudioresto: {
    name: 'Estudio Resto',
    apiUrl: 'https://api.estudioresto.com',
  },
};

export default restaurants;
