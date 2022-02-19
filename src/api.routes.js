import { Router } from "express";

import { CreateReportController } from "./controllers/CreateReportController";
import { AuthenticateUserController } from "./controllers/AuthenticateUserController";
import { CreateProfileController } from "./controllers/CreateProfileController";

//import { ensureAuthenticated } from "./middleware/ensureAuthenticated";

const router = Router();

router.post("/authenticate", new AuthenticateUserController().handle);
router.post("/reports", new CreateReportController().handle)
//router.post("/reports", ensureAuthenticated, new CreateReportController().handle)

router.post("/profile/create", new CreateProfileController().handle);

export { router }
