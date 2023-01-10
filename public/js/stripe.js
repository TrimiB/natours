import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { showAlert } from './alerts';

// /// Use this line if stripe is required through html script tag
// const stripe = Stripe(
//   'pk_test_51MMSqwBnzaWGF1I8ZUzQ4fIIeHLkwh6ZPgHGHvIRDKsbkXxKluLUygZ5l6QxYrYvy4aL35w1YLHdBWiigmVrUt9U00QxCAcaY0'
// );

// exporting booktour function
export const bookTour = async (tourId) => {
  try {
    const stripe = await loadStripe(
      'pk_test_51MMSqwBnzaWGF1I8ZUzQ4fIIeHLkwh6ZPgHGHvIRDKsbkXxKluLUygZ5l6QxYrYvy4aL35w1YLHdBWiigmVrUt9U00QxCAcaY0'
    );
    // 1) get checkout session from API srever
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    // 2) create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    console.log(error);
    showAlert('error', error);
  }
};
