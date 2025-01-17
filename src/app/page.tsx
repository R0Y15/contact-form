'use client';

import { useSession, signIn } from "next-auth/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import BackgroundBlob from "./components/BackgroundBlob";
import { useState } from "react";

const ContactSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  message: Yup.string().required("Message is required").min(10, "Message is too short"),
});

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <BackgroundBlob />
        <div className="min-h-screen pt-16 flex items-center justify-center px-4">
          <div className="w-full max-w-md p-8 bg-white/70 backdrop-blur-lg rounded-xl shadow-lg relative z-10">
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Please sign in
            </h2>
            <div className="mt-8">
              <button
                onClick={() => signIn()}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all transform hover:scale-[1.02]"
              >
                Sign in to continue
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <BackgroundBlob />
      <div className="min-h-screen pt-16 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg p-8 relative z-10">
            <div className="mb-6">
              <h2 className="text-center text-3xl font-extrabold bg-gradient-to-r from-violet-600 via-pink-600 to-violet-600 bg-clip-text text-transparent">
                Contact Us
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                We'd love to hear from you
              </p>
            </div>
            
            <Formik
              initialValues={{ 
                name: "", 
                email: session.user?.email || "", 
                message: "" 
              }}
              validationSchema={ContactSchema}
              onSubmit={async (values, { setSubmitting, resetForm, setStatus }) => {
                try {
                  const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                  });

                  const data = await response.json();

                  if (!response.ok) {
                    throw new Error(data.error || 'Something went wrong');
                  }

                  setStatus({ success: true });
                  setShowSuccess(true);
                  setTimeout(() => {
                    resetForm({ 
                      values: { 
                        name: "", 
                        email: session.user?.email || "", 
                        message: "" 
                      }
                    });
                    setShowSuccess(false);
                  }, 2000);
                } catch (error) {
                  setStatus({ success: false });
                  alert(error instanceof Error ? error.message : 'Failed to send message');
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting, status }) => (
                <Form className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                      <Field
                        id="name"
                        name="name"
                        type="text"
                        className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 sm:text-sm transition-all text-black"
                        placeholder="Your name"
                      />
                      <ErrorMessage name="name" component="div" className="text-pink-600 text-sm mt-1" />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        disabled
                        className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-500 sm:text-sm cursor-not-allowed"
                        readOnly
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                      <Field
                        as="textarea"
                        id="message"
                        name="message"
                        rows={3}
                        className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 sm:text-sm transition-all text-black"
                        placeholder="Your message"
                      />
                      <ErrorMessage name="message" component="div" className="text-pink-600 text-sm mt-1" />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting || showSuccess}
                      className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white transition-all transform hover:scale-[1.02] ${
                        isSubmitting 
                          ? 'bg-violet-400 cursor-not-allowed'
                          : showSuccess
                          ? 'bg-green-500 cursor-default'
                          : 'bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500'
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      ) : showSuccess ? (
                        <div className="flex items-center space-x-2">
                          <CheckIcon />
                          <span>Sent!</span>
                        </div>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}
