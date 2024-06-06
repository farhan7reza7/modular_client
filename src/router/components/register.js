import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../authContext";

const Register = () => {
  const { register } = useAuth();

  const formik = useFormik({
    initialValues: { user: "", password: "" },
    validationSchema: Yup.object().shape({
      user: Yup.string().required("Required field"),
      password: Yup.string().required("Required field"),
    }),
    onSubmit: register,
  });

  return (
    <div className="component">
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="user">Username</label>
        <input
          name="user"
          value={formik.values.user}
          type="text"
          id="user"
          onChange={formik.handleChange}
        />
        {formik.errors.user && formik.touched.user && (
          <div>{formik.errors.user}</div>
        )}
        <label htmlFor="pass">Password</label>
        <input
          name="password"
          value={formik.values.password}
          type="password"
          id="pass"
          onChange={formik.handleChange}
        />
        {formik.errors.password && formik.touched.password && (
          <div>{formik.errors.password}</div>
        )}
        <input type="submit" value="Register" />
      </form>
    </div>
  );
};

export default Register;
