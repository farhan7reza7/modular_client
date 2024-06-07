import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../authContext";

const Register = () => {
  const { register, invalidR } = useAuth();

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: Yup.object().shape({
      username: Yup.string().required("Required field"),
      password: Yup.string().required("Required field"),
    }),
    onSubmit: (values, formik) => register(values),
  });

  return (
    <div className="component">
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="user">Username</label>
        <input
          name="username"
          value={formik.values.username}
          type="text"
          id="user"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.errors.username && formik.touched.username && (
          <div>{formik.errors.username}</div>
        )}
        <label htmlFor="pass">Password</label>
        <input
          name="password"
          value={formik.values.password}
          type="password"
          id="pass"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.errors.password && formik.touched.password && (
          <div>{formik.errors.password}</div>
        )}
        <input type="submit" value="Register" disabled={formik.isSubmitting} />
        {invalidR && <div>Username already taken</div>}
      </form>
    </div>
  );
};

export default Register;
