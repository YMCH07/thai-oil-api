import { PttOilService as PttOilServiceClient } from "../config/oilservice";

const PttOilService = async () => {
  try {
    const client = new PttOilServiceClient();
    const fuels = await client.getCurrentOilPrice();

    return {
      status: "success",
      response: {
        note: "PTT Official Retail Prices",
        fuels,
      },
    };
  } catch (error) {
    return {
      status: "failure",
      response: "Service is unavailable, Please try again later.",
    };
  }
};

export default PttOilService;
