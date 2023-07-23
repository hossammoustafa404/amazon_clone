const router = require("express").Router();
const {
  getAllUsers,
  getSingleUser,
  updateMyInfo,
  updateUserInfo,
  deleteMyAccount,
  deleteUserAccount,
} = require("../controllers/users.controller");
const protect = require("../middlewares/protect");
const restrictedTo = require("../middlewares/restrictedTo");

router.get("/", getAllUsers);
router.get("/:userId", getSingleUser);

router.patch("/me", protect, updateMyInfo);
router.patch("/:userId", protect, restrictedTo("admin"), updateUserInfo);

router.delete("/me", protect, deleteMyAccount);
router.delete("/:userId", protect, restrictedTo("admin"), deleteUserAccount);

module.exports = router;
