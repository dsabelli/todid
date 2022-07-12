import { useState } from "react";
import registrationService from "../services/register";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ErrorMessage from "../components/UI/ErrorMessage";
import Button from "../components/UI/Button";

const schema = yup.object().shape({
  username: yup
    .string()
    .min(4)
    .max(18)
    .trim()
    .matches(/^[A-Za-z0-9]+$/i, {
      message: "Must not use special characters",
      excludeEmptyString: true,
    })
    .required(),
  email: yup.string().trim().email().required(),
  password: yup
    .string()
    .trim()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,16}$/, {
      message:
        "Must include 8-16 characters with a mix of letters, numbers & symbols.",
    })
    .required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "passwords must match"),
});

const Register = ({ handleNewUser }) => {
  const [asyncError, setAsyncError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const onSubmit = ({ username, email, password, confirmPassword }) =>
    handleRegistration({ username, email, password, confirmPassword });

  const handleRegistration = async ({
    email,
    username,
    password,
    confirmPassword,
  }) => {
    try {
      await registrationService.register({
        email,
        username,
        password,
        confirmPassword,
      });
      setAsyncError("");
      handleNewUser();
    } catch (error) {
      const errorMsg = error;
      setAsyncError(errorMsg);
      setTimeout(() => {
        setAsyncError(null);
      }, 5000);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Register now!</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <div className="card-body">
              <div className="form-control">
                <label htmlFor="email" className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="text"
                  name="email"
                  {...register("email")}
                  placeholder="email"
                  className="input input-bordered"
                />
                {errors.email && (
                  <ErrorMessage errorMessage={errors.email?.message} />
                )}
                {asyncError && <ErrorMessage errorMessage={asyncError} />}
              </div>
              <div className="form-control">
                <label htmlFor="username" className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  required
                  type="text"
                  name="username"
                  {...register("username")}
                  placeholder="username"
                  className="input input-bordered"
                />
                {errors.username && (
                  <ErrorMessage errorMessage={errors.username?.message} />
                )}
              </div>
              <div className="form-control">
                <label htmlFor="password" className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  {...register("password")}
                  placeholder="password"
                  className="input input-bordered"
                />
                {errors.password && (
                  <ErrorMessage errorMessage={errors.password?.message} />
                )}
              </div>
              <div className="form-control">
                <label htmlFor="confirmPassword" className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  {...register("confirmPassword")}
                  placeholder="confirm password"
                  className="input input-bordered"
                />
                {errors.confirmPassword && (
                  <ErrorMessage
                    errorMessage={errors.confirmPassword?.message}
                  />
                )}
              </div>
              <div className="form-control mt-6">
                <Button
                  text={"Register"}
                  type="submit"
                  className={"btn-primary"}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;