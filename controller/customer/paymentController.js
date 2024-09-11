const stripe = require('../../config/stripe');

const paymentController = async (req, res) => {
    // Extract allocationId and totalAmount from the request body
    const { allocationId, totalAmount } = req.body;
    try {
        // Creating the stripe checkout session
        const session = await stripe.checkout.sessions.create({
            // Specify the accepted payment method.
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        // Information about the product or service being purchased.
                        product_data: {
                            name: 'Service Payment',
                        },
                        // Stripe expects the amount to be in the smallest currency unit(paise for INR)
                        // So we multiply the totalAmount by 100.
                        unit_amount: totalAmount * 100,
                    },
                    // The quantity of the product or service being purchased
                    quantity: 1,
                }
            ],
            // Specify the payment mode. 'payment' means this is a one-time payment.
            mode: 'payment',
            // Success url redirects the user upon successful payment, appending the session ID for further reference.
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            // Cancel url redirects the user if the payment process is cancelled
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
            // Metadata allows passing additional custom data that will be available in the session.
            metadata: {
                allocationId: allocationId,
            },
        });

        // Respond with session ID
        res.status(200).json({
            id: session.id,
        })
        
    } catch (error) {
        console.error('Error creating Stripe session:', error.message);
        res.status(500).json({ message: error.message });
    }
}

module.exports = paymentController;