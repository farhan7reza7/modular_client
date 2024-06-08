import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../authContext";

const Reset = () => {
  const { reset, token, userId } = useAuth();

  const formik = useFormik({
    initialValues: { password: "" },
    validationSchema: Yup.object().shape({
      password: Yup.string().required("Required field"),
    }),
    onSubmit: (values, formik) => reset({ password: values.password, userId }),
  });

  return (
    <div className="component">
      <div>
        <p>Reset password</p>
        <form onSubmit={formik.handleSubmit}>
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
          <input type="submit" value="Submit" disabled={formik.isSubmitting} />
        </form>
      </div>
    </div>
  );
};

export default Reset;
