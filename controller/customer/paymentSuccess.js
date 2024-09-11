const stripe = require('../../config/stripe');
const mechanicTargetsModel = require('../../models/mechanicTargetsModel');
const serviceHistoryModel = require('../../models/serviceHistoryModel');
const moment = require("moment");

const paymentSuccess = async (req, res) => {
    // Extract the sessionId from the request body
    const { sessionId } = req.body;

    try {
        // Retrieve the session from stripe using the sessionId
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // Extract metadata (allocationId) from the session
        const allocationId = session.metadata.allocationId;

        // Fetch the service history details from the data base
        const serviceDetails = await serviceHistoryModel.findOne({ allocation: allocationId })
            .populate({
                path: 'allocation',
                populate: {
                    path: 'bookingId',
                    select: 'status',
                }
            });

        // Calculate the total of extra works
        const extraWorksTotal = serviceDetails?.extraWorks?.reduce((total, work) => total + work.price, 0) || 0;
        // Calculate the labourAchieved 
        const labourAchieved = extraWorksTotal + serviceDetails?.serviceCharge;

        // Spare achievements
        const spareAchieved = serviceDetails?.allocation?.totalPartsPrice;

        // Get the current month and year in 'YYYY-MM' format
        const targetMonth = moment().format('YYYY-MM');

        // Find the mechanic's target for the current month
        const mechanicTarget = await mechanicTargetsModel.findOne({
            mechanicId: serviceDetails?.allocation?.mechanicId,
            'achievement.month': targetMonth
        });

        // If no target found, return an error
        if (!mechanicTarget) {
            return res.status(404).json({
                message: 'Mechanic target not found',
                success: false
            });
        }

        // Find the correct achievement for the current month
        const achievement = mechanicTarget.achievement.find(ach => ach.month === targetMonth);

        // Update the labour and spare achievements
        if (labourAchieved !== undefined) achievement.labourAchievement = achievement.labourAchievement + labourAchieved;
        if (spareAchieved !== undefined) achievement.spareAchievement = achievement.spareAchievement + spareAchieved;

        await mechanicTarget.save();

        // Update the booking status to 'Paid'
        const booking = serviceDetails?.allocation?.bookingId;
        if (booking) {
            booking.status = 'Paid';
            await booking.save();
        }


        res.status(200).json({
            message: 'Labour and spare achievement updated and booking status marked as paid'
        })

    } catch (error) {
        console.error('Error processing payment success:', error);
        res.status(500).json({ message: error.message });
    }

}

module.exports = paymentSuccess;