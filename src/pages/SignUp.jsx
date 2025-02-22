import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db } from '../firebase.config';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { FaPiggyBank } from "react-icons/fa6";

function SignUp() {
  const navigate = useNavigate();

  const formik = useFormik({
      initialValues: {
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          terms: false,
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          phoneNumber: '',
          address: '',
          city: '',
          postalCode: '',
          country: ''
      },
      validationSchema: Yup.object({
          name: Yup.string()
              .required('Your name is required'),
          email: Yup.string()
              .email('Invalid email address')
              .required('Email address is required'),
          password: Yup.string()
              .min(8, 'Password must be at least 8 characters long')
              .required('Password is required'),
          confirmPassword: Yup.string()
              .oneOf([Yup.ref('password'), null], 'Passwords must match')
              .required('Please confirm your password'),
          terms: Yup.boolean()
              .oneOf([true], 'You must accept the terms and conditions')
      }),
      onSubmit: async values => {
          if (!values.terms) {
              toast.error('You must accept the terms and conditions to proceed.');
              return;
          }
          try {
              const auth = getAuth();
              const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
              const user = userCredential.user;

              // Update user profile with displayName
              await updateProfile(user, {
                  displayName: values.name,
              });

              // Save user data to Firestore
              await setDoc(doc(db, 'users', user.uid), {
                  name: values.name,
                  email: values.email,
                  firstName: '',
                  lastName: '',
                  dateOfBirth: '',
                  phoneNumber: '',
                  address: '',
                  city: '',
                  postalCode: '',
                  country: '',
                  timestamp: serverTimestamp()
              });

              navigate('/');
              toast.success('Account created successfully!');
          } catch (error) {
              if (error.code === 'auth/email-already-in-use') {
                  toast.error('This email address is already in use.');
              } else {
                  toast.error('Something went wrong with registration');
              }
          }
      },
  });

    return (
      <>
        <section>
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-xl shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Create an account
                        </h1>

                        <form className="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    required
                                />
                                {formik.touched.name && formik.errors.name ? <div className="text-red-500 text-xs italic">{formik.errors.name}</div> : null}
                            </div>

                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    required
                                />
                                {formik.touched.email && formik.errors.email ? <div className="text-red-500 text-xs italic">{formik.errors.email}</div> : null}
                            </div>

                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    required
                                />
                                {formik.touched.password && formik.errors.password ? <div className="text-red-500 text-xs italic">{formik.errors.password}</div> : null}
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.confirmPassword}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    required
                                />
                                {formik.touched.confirmPassword && formik.errors.confirmPassword ? <div className="text-red-500 text-xs italic">{formik.errors.confirmPassword}</div> : null}
                            </div>

                            <div className="flex items-center mb-4">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    checked={formik.values.terms}
                                    className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500"
                                />
                                <label htmlFor="terms" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree to the terms and conditions.</label>
                                {formik.touched.terms && formik.errors.terms ? <div className="text-red-500 text-xs italic">{formik.errors.terms}</div> : null}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-full dark:bg-gray-700 dark:text-gray-300 text-black hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-xl text-sm px-5 py-2.5 text-center"
                                disabled={formik.isSubmitting}
                            >
                                Create an account
                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Already have an account?{" "}
                                <Link
                                    to="/sign-in"
                                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                >
                                    Login here
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
      </>
    );
}

export default SignUp;
