import { useFormik } from "formik";
import { useCallback, useState } from "react";
import * as Yup from "yup";
import { useAuth } from "../authContext";

const LogIn = () => {
  const [check, setCheck] = useState(false);
  const { login, invalidL } = useAuth();
  const handleSubmit = useCallback(
    async (values, formik) => {
      formik.setSubmitting(true);
      formik.setStatus("Processing...");
      try {
        /*  setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          //formik.resetForm();*/
        login(values);
        formik.setStatus("");
        formik.setSubmitting(false);
        //}, 500);
      } catch {
        formik.setStatus("error in submitting form");
      }
    },
    [login]
  );

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: Yup.object().shape({
      username: Yup.string().required("Required field"),
      password: Yup.string().required("Required field"),
    }),
    onSubmit: handleSubmit,
  });

  return (
    <div className="component">
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="user">Username</label>
        <input
          name="username"
          type="text"
          id="user"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.username && formik.errors.username ? (
          <div>{formik.errors.username}</div>
        ) : (
          ""
        )}
        <label htmlFor="pass">Password</label>
        <input
          name="password"
          type="password"
          id="pass"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.password && formik.errors.password ? (
          <div>{formik.errors.password}</div>
        ) : (
          ""
        )}
        <input
          type="submit"
          onClick={() => setCheck(true)}
          disabled={formik.isSubmitting}
          value="Log in"
        />
        {formik.isValidating && <div>Validating...</div>}
        {!formik.isValid && check ? <div>Not Valid Form...</div> : ""}
        <div>{formik.status}</div>
        {invalidL && <div>Please fill correct details, and then submit</div>}
      </form>
    </div>
  );
};

export default LogIn;
