import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../authContext";
import { useLocation } from "react-router-dom";
import Register from "./register";

const Otp = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get("token");
  const username = query.get("username");
  const password = query.get("password");
  const email = query.get("email");

  const { verifyMfa, messageMfa, invalidMfa, register } = useAuth();
  const formik = useFormik({
    initialValues: { otp: "" },
    validationSchema: Yup.object().shape({
      otp: Yup.string().required("Required field"),
    }),
    onSubmit: (values, formik) =>
      verifyMfa({ otp: values.otp, username, password, token, email }),
  });

  return (
    <div className="component">
      <div>
        <p>Verify otp</p>
        <form onSubmit={formik.handleSubmit}>
          <label htmlFor="otp">Otp</label>
          <input
            name="otp"
            value={formik.values.otp}
            type="text"
            id="otp"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.otp && formik.touched.otp && (
            <div>{formik.errors.otp}</div>
          )}
          <input type="submit" value="Submit" disabled={formik.isSubmitting} />
          <div>{messageMfa}</div>
          {invalidMfa &&
            (messageMfa === "otp expired, please generate new otp" ||
              messageMfa === "please enter correct otp") && (
              <div>
                <button
                  type="button"
                  onClick={() => register({ username, password, email })}
                >
                  Regenerate otp
                </button>
              </div>
            )}
        </form>
      </div>
    </div>
  );
};

export default Otp;
