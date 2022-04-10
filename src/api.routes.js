import { Router } from "express";

import { AuthenticateUserController } from "./controllers/AuthenticateUserController";
import { UpdateProfileController } from "./controllers/UpdateProfileController";

import { CreateReportController } from "./controllers/CreateReportController";
import { UpdateReportController } from "./controllers/UpdateReportController";
import { DeleteReportController } from "./controllers/DeleteReportController";

import { CreateCommentInReportController } from "./controllers/CreateCommentInReportController";
import { DeleteCommentInReportController } from "./controllers/DeleteCommentInReportController";

import { UpdateUserExperienceController } from "./controllers/UpdateUserExperienceController";

import { ReadProfileController } from "./controllers/ReadProfileController";
import { ReadUserController } from "./controllers/ReadUserController";

import { ReadReportsWithFilterController } from "./controllers/ReadReportsWithFilterController";

import { UploadImageController, DeleteImageController } from "./controllers/api_calls/ImageController"

import { ensureAuthenticated } from "./middleware/ensureAuthenticated";

const router = Router();

// Autenticação do Usuário
router.post("/authenticate", new AuthenticateUserController().handle);
router.post("/user", ensureAuthenticated, new ReadUserController().handle);

// Seção de Relatórios
router.post("/report/create", ensureAuthenticated, new CreateReportController().handle)
router.post("/report/update", ensureAuthenticated, new UpdateReportController().handle)
router.post("/report/delete", ensureAuthenticated, new DeleteReportController().handle)

router.post("/report/comments/create", ensureAuthenticated, new CreateCommentInReportController().handle)
router.post("/report/comments/delete", ensureAuthenticated, new DeleteCommentInReportController().handle)

router.post("/reports/search", ensureAuthenticated, new ReadReportsWithFilterController().handle)

// Seção de Perfil
router.post("/profile", new ReadProfileController().handle);
router.post("/profile/update", ensureAuthenticated, new UpdateProfileController().handle);
router.post("/profile/update/experience", ensureAuthenticated, new UpdateUserExperienceController().handle);

// Seção de Imagem
router.post("/upload", ensureAuthenticated, new UploadImageController().handle);
router.post("/delete", ensureAuthenticated, new DeleteImageController().handle);

export { router }
