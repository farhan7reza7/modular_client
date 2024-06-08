import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../authContext";

const Forget = () => {
  const { forget } = useAuth();

  const formik = useFormik({
    initialValues: { username: "", email: "" },
    validationSchema: Yup.object().shape({
      username: Yup.string().required("Required field"),
      email: Yup.string().email("not email type").required("Required field"),
    }),
    onSubmit: async (values, formik) => {
      formik.setSubmitting(true);
      await forget(values);
      formik.setSubmitting(false);
    },
  });

  return (
    <div className="component">
      <div>
        <p>Account Details to reset password</p>
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
          <label htmlFor="email">Email</label>
          <input
            name="email"
            value={formik.values.email}
            type="email"
            id="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.email && formik.touched.email && (
            <div>{formik.errors.email}</div>
          )}
          <input type="submit" value="Submit" disabled={formik.isSubmitting} />
        </form>
      </div>
    </div>
  );
};

export default Forget;
