const router = require("express").Router();
const {
  getAllUsers,
  getSingleUser,
  updateUserInfo,
  deleteMyAccount,
  deleteAccount,
  deleteUser,
} = require("../controllers/users.controller");
const protect = require("../middlewares/protect");
const restrictedTo = require("../middlewares/restrictedTo");

router.get("/", getAllUsers);
router.get("/:userId", getSingleUser);

router.patch("/update-info", protect, updateUserInfo);
router.patch(
  "/update-info/:userId",
  protect,
  restrictedTo("admin"),
  updateUserInfo
);

router.delete("/delete-user", protect, deleteUser);
router.delete(
  "/delete-user/:userId",
  protect,
  restrictedTo("admin"),
  deleteUser
);

module.exports = router;
