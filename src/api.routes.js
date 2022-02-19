import { Router } from "express";

import { AuthenticateUserController } from "./controllers/AuthenticateUserController";
import { CreateProfileController } from "./controllers/CreateProfileController";
import { CreateReportController } from "./controllers/CreateReportController";

import { ReadUserController } from "./controllers/ReadUserController";
import { ReadUserReportsController } from "./controllers/GetUserReportsController";

//router.post("/reports", ensureAuthenticated, new CreateReportController().handle)
//import { ensureAuthenticated } from "./middleware/ensureAuthenticated";

const router = Router();

router.post("/authenticate", new AuthenticateUserController().handle);
router.post("/report/create", new CreateReportController().handle)
router.post("/profile/create", new CreateProfileController().handle);

router.post("/user", new ReadUserController().handle);
router.post("/user/reports", new ReadUserReportsController().handle)

export { router }
