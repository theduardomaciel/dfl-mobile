import { Router } from "express";

import { AuthenticateUserController } from "./controllers/AuthenticateUserController";
import { UpdateProfileController } from "./controllers/UpdateProfileController";

import { CreateReportController } from "./controllers/CreateReportController";
import { DeleteReportController } from "./controllers/DeleteReportController";

import { UpdateUserExperienceController } from "./controllers/UpdateUserExperienceController";

import { ReadUserController } from "./controllers/ReadUserController";
import { ReadUserReportsController } from "./controllers/GetUserReportsController";

import { UploadImageController, DeleteImageController } from "./controllers/api_calls/ImageController"

import { ensureAuthenticated } from "./middleware/ensureAuthenticated";

const router = Router();

router.post("/authenticate", new AuthenticateUserController().handle);

router.post("/report/create", ensureAuthenticated, new CreateReportController().handle)
router.post("/report/delete", ensureAuthenticated, new DeleteReportController().handle)

router.post("/profile/update", new UpdateProfileController().handle);
router.post("/profile/update/experience", new UpdateUserExperienceController().handle);

router.post("/user", new ReadUserController().handle);
router.post("/user/reports", new ReadUserReportsController().handle)

router.post("/upload", ensureAuthenticated, new UploadImageController().handle);
router.post("/delete", ensureAuthenticated, new DeleteImageController().handle);

export { router }
