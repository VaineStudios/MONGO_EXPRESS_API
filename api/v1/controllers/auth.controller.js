const User = require("../../../schema/user.schema");
const { JSONResponse } = require("../../../utilities/response.utility");
const JWTHelper = require("../../../utilities/token.utility");


class AuthController {
   static authenticate = async (req, res, next) => {
      try {
         let { email, password } = req.body;
         let user = await User.findOne({ email: email });
         if (!user)
            throw new Error("No user present which matches the email");
         let passCheck = await user.isCorrectPassword(password);
         if (!passCheck) throw new Error("Invalid password");
         let data = user;
          JWTHelper.setToken(
            req,
            res,
             { id: user._id, email: user.email, isSuperAdmin: user.isSuperAdmin},
             "Jwt-token",
             "3600"
             );
             data.password = undefined;
            data.isSuperAdmin = undefined;
         JSONResponse.success(
            res,
            "User is authenticated successfully",
            {
                user, 
                token: res.cookie
            },

            200
         );
      } catch (error) {
         JSONResponse.error(res, "User not Authenticated", error, 401);
      }
   };
}

module.exports = AuthController;