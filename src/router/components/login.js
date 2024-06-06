import { useFormik } from "formik";
import { useCallback } from "react";
import * as Yup from "yup";
import { useAuth } from "../authContext";

const LogIn = () => {
  const { login } = useAuth();
  const handleSubmit = useCallback(
    async (values, formik) => {
      formik.setSubmitting(true);
      formik.setStatus("Processing...");
      try {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          formik.setSubmitting(false);
          formik.resetForm();
          login(values);
        }, 500);
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
        />
        {formik.touched.password && formik.errors.password ? (
          <div>{formik.errors.password}</div>
        ) : (
          ""
        )}
        <input type="submit" disabled={!formik.isValid} value="Log in" />
        {formik.isValidating && <div>Validating...</div>}
        {!formik.isValid && <div>Not Valid Form...</div>}
        <div>Form status: {formik.status}</div>
      </form>
    </div>
  );
};

export default LogIn;
