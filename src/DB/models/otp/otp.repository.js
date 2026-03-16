import { DBRepository } from "../../db.repository.js";
import { OTP } from "./otp.model.js";

class OTPRepository extends DBRepository {
  constructor() {
    super(OTP);
  }
}
export const otpRepository = new OTPRepository();
