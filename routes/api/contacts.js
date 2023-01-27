const express = require('express');
const { wrapper, validator } = require("../../midWare/index");
const { joi, joiFavorite } = require("../../schemas/schemas");
const {
  getContactById,
  listContacts,
  addContact,
  removeContactById,
  updateById,
  updateFavorite
} = require("../../controlers/controlers")
const router = express.Router();
const { authenticate } = require("../../midWare/auth");


router.get("/", authenticate, wrapper(listContacts));
router.get("/:contactId", authenticate, wrapper(getContactById));
router.post("/", validator(joi), authenticate, wrapper(addContact));
router.delete("/:contactId", authenticate, wrapper(removeContactById));
router.put("/:contactId", authenticate, validator(joi), wrapper( updateById));
router.patch(
  "/:contactId/favorite",
  validator(joiFavorite),
  wrapper(updateFavorite)
);

module.exports = router;
