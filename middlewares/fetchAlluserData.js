// Adds all user data to the request object
import { getAllUserData } from "../models/userModel.js";

// Utilities
import { reformatAllDataObject } from "../utils/reformatAllDataObject.js";

export async function fetchAlluserData(req, res, next) {
  if (req.user) {
    const userID = req.user.id;

    try {
      const allData = await getAllUserData(userID);

      const formattedAllData = reformatAllDataObject(allData);

      req.data = formattedAllData;

      next();

      return;
    } catch (error) {
      res
        .status(500)
        .send(`And error occured.\nError message: ${error.message}`);

      return;
    }
  }

  next();
}
